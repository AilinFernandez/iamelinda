const express = require('express');
const cors = require('cors');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Importar servicios
const fanficService = require('./services/fanficService');
const openaiService = require('./services/openai');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar multer para subida de archivos
const upload = multer({ dest: 'uploads/' });

// Middleware para verificar admin
const requireAdmin = (req, res, next) => {
  const { password } = req.headers;
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Acceso no autorizado' });
  }
  next();
};

// ==================== RUTAS PÚBLICAS ====================

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    message: 'iamelinda - Sistema de Recomendación de Fanfics',
    version: '1.0.0',
    status: 'active',
    endpoints: {
      search: 'POST /api/search',
      stats: 'GET /api/stats',
      admin: 'GET /api/admin/* (requiere password)'
    }
  });
});

// Verificar estado del servidor
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    firebase: 'connected',
    openai: process.env.OPENAI_API_KEY ? 'configured' : 'missing'
  });
});

// Buscar fanfics (ruta principal para usuarios)
app.post('/api/search', async (req, res) => {
  try {
    const { query, maxResults = 10 } = req.body;
    
    if (!query || query.trim().length === 0) {
      return res.status(400).json({ error: 'Consulta de búsqueda requerida' });
    }

    console.log(`🔍 Nueva búsqueda: "${query}"`);
    const startTime = Date.now();

    // 1. Procesar consulta con IA
    const searchCriteria = await openaiService.processSearchQuery(query);
    console.log('Criterios extraídos:', searchCriteria);

    // 2. Buscar fanfics en Firebase
    const fanfics = await fanficService.searchFanfics(searchCriteria, maxResults);
    console.log(`Encontrados ${fanfics.length} fanfics`);

    // 3. Generar explicación con IA
    const explanation = await openaiService.generateRecommendationExplanation(
      fanfics, 
      query, 
      searchCriteria
    );

    // 4. Generar sugerencias relacionadas
    const suggestions = await openaiService.generateSearchSuggestions(query, searchCriteria);

    const searchTime = (Date.now() - startTime) / 1000;

    res.json({
      fanfics,
      totalResults: fanfics.length,
      searchCriteria,
      explanation,
      suggestions,
      searchTime,
      query
    });

  } catch (error) {
    console.error('Error en búsqueda:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      message: error.message 
    });
  }
});

// Obtener estadísticas públicas
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await fanficService.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ error: 'Error obteniendo estadísticas' });
  }
});

// ==================== RUTAS DE ADMINISTRACIÓN ====================

// Obtener todos los fanfics (admin)
app.get('/api/admin/fanfics', requireAdmin, async (req, res) => {
  try {
    const fanfics = await fanficService.getAllFanfics();
    res.json(fanfics);
  } catch (error) {
    console.error('Error obteniendo fanfics:', error);
    res.status(500).json({ error: 'Error obteniendo fanfics' });
  }
});

// Crear un fanfic manualmente (admin)
app.post('/api/admin/fanfics', requireAdmin, async (req, res) => {
  try {
    const { titulo, autor, resumen, etiquetas, advertencias, enlace } = req.body;
    
    // Validaciones básicas
    if (!titulo || !autor || !enlace) {
      return res.status(400).json({ 
        error: 'Título, autor y enlace son campos requeridos' 
      });
    }

    const fanficData = {
      titulo: titulo.trim(),
      autor: autor.trim(),
      resumen: resumen?.trim() || '',
      etiquetas: Array.isArray(etiquetas) ? etiquetas : 
                 typeof etiquetas === 'string' ? etiquetas.split(',').map(t => t.trim()) : [],
      advertencias: advertencias?.trim() || '',
      enlace: enlace.trim()
    };

    const newFanfic = await fanficService.createFanfic(fanficData);
    res.status(201).json(newFanfic);
  } catch (error) {
    console.error('Error creando fanfic:', error);
    res.status(500).json({ error: 'Error creando fanfic' });
  }
});

// Subir fanfics desde CSV (admin)
app.post('/api/admin/upload-csv', requireAdmin, upload.single('csvFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Archivo CSV requerido' });
    }

    const results = [];
    const filePath = req.file.path;

    // Leer y procesar CSV
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
          // Mapear columnas del CSV a nuestro formato
          const fanfic = {
            titulo: data.Titulo?.trim() || '',
            autor: data.Autor?.trim() || '',
            resumen: data.Resumen?.trim() || '',
            etiquetas: data.Etiquetas ? data.Etiquetas.split(',').map(t => t.trim()) : [],
            advertencias: data.Advertencias?.trim() || '',
            enlace: data.Enlace?.trim() || ''
          };

          // Validar que tenga los campos mínimos
          if (fanfic.titulo && fanfic.autor && fanfic.enlace) {
            results.push(fanfic);
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });

    // Eliminar archivo temporal
    fs.unlinkSync(filePath);

    if (results.length === 0) {
      return res.status(400).json({ 
        error: 'No se encontraron fanfics válidos en el CSV' 
      });
    }

    // Obtener opciones de duplicados del body (a través de FormData)
    const skipDuplicates = req.body.skipDuplicates !== 'false'; // Por defecto true
    const updateDuplicates = req.body.updateDuplicates === 'true'; // Por defecto false
    
    // Guardar en Firebase con opciones de duplicados
    const processResults = await fanficService.createMultipleFanfics(results, {
      skipDuplicates,
      updateDuplicates
    });
    
    res.json({
      message: `CSV procesado exitosamente`,
      results: processResults,
      summary: {
        total: processResults.total,
        nuevos: processResults.successful.length,
        duplicados: processResults.duplicates.length,
        actualizados: processResults.updated.length,
        fallidos: processResults.failed.length
      }
    });

  } catch (error) {
    console.error('Error subiendo CSV:', error);
    
    // Limpiar archivo temporal si existe
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ error: 'Error procesando archivo CSV' });
  }
});

// Actualizar un fanfic (admin)
app.put('/api/admin/fanfics/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const updatedFanfic = await fanficService.updateFanfic(id, updates);
    res.json(updatedFanfic);
  } catch (error) {
    console.error('Error actualizando fanfic:', error);
    res.status(500).json({ error: 'Error actualizando fanfic' });
  }
});

// Eliminar un fanfic (admin)
app.delete('/api/admin/fanfics/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await fanficService.deleteFanfic(id);
    res.json({ message: 'Fanfic eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando fanfic:', error);
    res.status(500).json({ error: 'Error eliminando fanfic' });
  }
});

// Estadísticas detalladas (admin)
app.get('/api/admin/stats', requireAdmin, async (req, res) => {
  try {
    const stats = await fanficService.getStats();
    const detailedStats = {
      ...stats,
      serverInfo: {
        uptime: process.uptime(),
        nodeVersion: process.version,
        environment: process.env.NODE_ENV || 'development'
      }
    };
    res.json(detailedStats);
  } catch (error) {
    console.error('Error obteniendo estadísticas admin:', error);
    res.status(500).json({ error: 'Error obteniendo estadísticas' });
  }
});

// ==================== MANEJO DE ERRORES ====================

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    availableEndpoints: [
      'GET /',
      'GET /health',
      'POST /api/search',
      'GET /api/stats',
      'GET /api/admin/* (requiere autenticación)'
    ]
  });
});

// Manejador de errores global
app.use((error, req, res, next) => {
  console.error('Error no manejado:', error);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  console.log(`📍 API disponible en: http://localhost:${PORT}`);
  console.log(`🔍 Búsqueda: POST http://localhost:${PORT}/api/search`);
  console.log(`👑 Admin: http://localhost:${PORT}/api/admin/*`);
  
  if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠️  OPENAI_API_KEY no configurada');
  }
  
  if (!process.env.FIREBASE_PROJECT_ID) {
    console.warn('⚠️  Firebase no configurado');
  }
});
