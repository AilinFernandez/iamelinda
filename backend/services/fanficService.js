const { db } = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');

const COLLECTION_NAME = 'fanfics';
const REVIEWS_COLLECTION = 'reviews';
const POSTS_COLLECTION = 'posts';
const LIBRARY_COLLECTION = 'library';

/**
 * Buscar fanfics basado en criterios de búsqueda
 */
async function searchFanfics(searchCriteria, limit = 10) {
  try {
    const { keywords, fandom, characters, relationships, genres } = searchCriteria;
    
    // Comenzar con la colección base
    let query = db.collection(COLLECTION_NAME);
    
    // Construir términos de búsqueda para buscar en texto
    const searchTerms = [
      ...(keywords || []),
      ...(characters || []),
      ...(relationships || []),
      ...(genres || [])
    ].filter(Boolean);
    
    // Si hay un fandom específico, filtrar por él
    if (fandom) {
      searchTerms.unshift(fandom);
    }
    
    // Obtener todos los documentos (Firebase no tiene búsqueda de texto completo nativa)
    const snapshot = await query.limit(100).get(); // Limitar para performance
    
    if (snapshot.empty) {
      return [];
    }
    
    const allFanfics = [];
    snapshot.forEach(doc => {
      allFanfics.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Búsqueda en memoria (para prototipo)
    const results = allFanfics.filter(fanfic => {
      const searchText = [
        fanfic.titulo,
        fanfic.autor,
        fanfic.resumen,
        ...(fanfic.etiquetas || [])
      ].join(' ').toLowerCase();
      
      // Verificar si algún término de búsqueda está en el texto
      return searchTerms.some(term => 
        searchText.includes(term.toLowerCase())
      );
    });
    
    // Ordenar por relevancia (simple: más coincidencias = más relevante)
    results.sort((a, b) => {
      const scoreA = calculateRelevanceScore(a, searchTerms);
      const scoreB = calculateRelevanceScore(b, searchTerms);
      return scoreB - scoreA;
    });
    
    return results.slice(0, limit);
  } catch (error) {
    console.error('Error buscando fanfics:', error);
    throw error;
  }
}

/**
 * Calcular puntuación de relevancia basada en coincidencias
 */
function calculateRelevanceScore(fanfic, searchTerms) {
  let score = 0;
  const searchText = [
    fanfic.titulo,
    fanfic.autor, 
    fanfic.resumen,
    ...(fanfic.etiquetas || [])
  ].join(' ').toLowerCase();
  
  searchTerms.forEach(term => {
    const termLower = term.toLowerCase();
    // Título tiene más peso
    if (fanfic.titulo.toLowerCase().includes(termLower)) score += 3;
    // Etiquetas tienen peso medio
    if (fanfic.etiquetas?.some(tag => tag.toLowerCase().includes(termLower))) score += 2;
    // Resumen tiene peso normal
    if (fanfic.resumen?.toLowerCase().includes(termLower)) score += 1;
  });
  
  return score;
}

/**
 * Obtener todos los fanfics (para admin)
 */
async function getAllFanfics() {
  try {
    const snapshot = await db.collection(COLLECTION_NAME).get();
    const fanfics = [];
    
    snapshot.forEach(doc => {
      fanfics.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return fanfics;
  } catch (error) {
    console.error('Error obteniendo fanfics:', error);
    throw error;
  }
}

/**
 * Crear un nuevo fanfic
 */
async function createFanfic(fanficData) {
  try {
    const id = uuidv4();
    const fanfic = {
      ...fanficData,
      id,
      fecha_subida: new Date(),
      fecha_actualizacion: new Date()
    };
    
    await db.collection(COLLECTION_NAME).doc(id).set(fanfic);
    return { id, ...fanfic };
  } catch (error) {
    console.error('Error creando fanfic:', error);
    throw error;
  }
}

/**
 * Verificar si un fanfic ya existe por enlace
 */
async function checkDuplicateByUrl(enlace) {
  try {
    if (!enlace) return null;
    
    const snapshot = await db.collection(COLLECTION_NAME)
      .where('enlace', '==', enlace)
      .limit(1)
      .get();
    
    if (snapshot.empty) {
      return null;
    }
    
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    };
  } catch (error) {
    console.error('Error verificando duplicado:', error);
    return null;
  }
}

/**
 * Crear múltiples fanfics desde CSV con detección de duplicados
 */
async function createMultipleFanfics(fanficsArray, options = {}) {
  try {
    const { skipDuplicates = true, updateDuplicates = false } = options;
    
    const results = {
      successful: [],
      failed: [],
      duplicates: [],
      updated: [],
      total: fanficsArray.length
    };

    console.log(`📚 Procesando ${fanficsArray.length} fanfics...`);
    console.log(`🔍 Configuración: skipDuplicates=${skipDuplicates}, updateDuplicates=${updateDuplicates}`);

    for (let i = 0; i < fanficsArray.length; i++) {
      const fanficData = fanficsArray[i];
      
      try {
        console.log(`[${i + 1}/${fanficsArray.length}] Procesando: ${fanficData.titulo || 'Sin título'}`);
        
        // Verificar duplicados por enlace
        const existingFanfic = await checkDuplicateByUrl(fanficData.enlace);
        
        if (existingFanfic) {
          console.log(`   🔄 Duplicado encontrado: ${existingFanfic.titulo}`);
          
          if (updateDuplicates) {
            // Actualizar el fanfic existente
            const updatedFanfic = await updateFanfic(existingFanfic.id, fanficData);
            results.updated.push({
              index: i,
              id: existingFanfic.id,
              titulo: fanficData.titulo,
              enlace: fanficData.enlace
            });
            console.log(`   ✅ Actualizado`);
          } else if (skipDuplicates) {
            // Marcar como duplicado y continuar
            results.duplicates.push({
              index: i,
              id: existingFanfic.id,
              titulo: fanficData.titulo,
              enlace: fanficData.enlace,
              existing_title: existingFanfic.titulo
            });
            console.log(`   ⏭️ Omitido (duplicado)`);
          } else {
            // Error si no se permite ninguna de las opciones anteriores
            results.failed.push({
              index: i,
              titulo: fanficData.titulo,
              error: 'Fanfic duplicado encontrado'
            });
            console.log(`   ❌ Rechazado (duplicado)`);
          }
        } else {
          // Crear nuevo fanfic
          const fanfic = await createFanfic(fanficData);
          results.successful.push({
            index: i,
            id: fanfic.id,
            titulo: fanfic.titulo
          });
          console.log(`   ✅ Creado exitosamente`);
        }
        
      } catch (error) {
        console.error(`❌ Error procesando fanfic ${i + 1}:`, error.message);
        results.failed.push({
          index: i,
          titulo: fanficData.titulo || 'Sin título',
          error: error.message
        });
      }
    }

    console.log(`\n📊 Resumen de carga:`);
    console.log(`   ✅ Nuevos creados: ${results.successful.length}`);
    console.log(`   🔄 Duplicados encontrados: ${results.duplicates.length}`);
    console.log(`   📝 Actualizados: ${results.updated.length}`);
    console.log(`   ❌ Fallidos: ${results.failed.length}`);
    
    return results;

  } catch (error) {
    console.error('Error en createMultipleFanfics:', error);
    throw error;
  }
}

/**
 * Actualizar un fanfic
 */
async function updateFanfic(id, updates) {
  try {
    const updateData = {
      ...updates,
      fecha_actualizacion: new Date()
    };
    
    await db.collection(COLLECTION_NAME).doc(id).update(updateData);
    return { id, ...updateData };
  } catch (error) {
    console.error('Error actualizando fanfic:', error);
    throw error;
  }
}

/**
 * Eliminar un fanfic
 */
async function deleteFanfic(id) {
  try {
    await db.collection(COLLECTION_NAME).doc(id).delete();
    return { success: true };
  } catch (error) {
    console.error('Error eliminando fanfic:', error);
    throw error;
  }
}

/**
 * Obtener estadísticas de la base de datos
 */
async function getStats() {
  try {
    const snapshot = await db.collection(COLLECTION_NAME).get();
    const totalFanfics = snapshot.size;
    
    const fandoms = {};
    const autores = {};
    
    snapshot.forEach(doc => {
      const data = doc.data();
      
      // Contar fandoms (extraer del primer tag generalmente)
      if (data.etiquetas && data.etiquetas.length > 0) {
        const fandom = data.etiquetas.find(tag => 
          tag.includes('Harry Potter') || 
          tag.includes('Marvel') || 
          tag.includes('Twilight') ||
          tag.includes('Percy Jackson') ||
          tag.includes('Avatar')
        ) || 'Otros';
        fandoms[fandom] = (fandoms[fandom] || 0) + 1;
      }
      
      // Contar autores
      if (data.autor) {
        autores[data.autor] = (autores[data.autor] || 0) + 1;
      }
    });
    
    return {
      totalFanfics,
      totalFandoms: Object.keys(fandoms).length,
      totalAutores: Object.keys(autores).length,
      topFandoms: Object.entries(fandoms)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([fandom, count]) => ({ fandom, count })),
      topAutores: Object.entries(autores)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([autor, count]) => ({ autor, count }))
    };
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    throw error;
  }
}

// ==================== GESTIÓN DE RESEÑAS ====================

/**
 * Obtener todas las reseñas
 */
async function getReviews() {
  try {
    const snapshot = await db.collection(REVIEWS_COLLECTION)
      .orderBy('createdAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error obteniendo reseñas:', error);
    throw error;
  }
}

/**
 * Crear nueva reseña
 */
async function createReview(reviewData) {
  try {
    const id = uuidv4();
    const review = {
      id,
      ...reviewData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await db.collection(REVIEWS_COLLECTION).doc(id).set(review);
    return review;
  } catch (error) {
    console.error('Error creando reseña:', error);
    throw error;
  }
}

/**
 * Actualizar reseña
 */
async function updateReview(id, updateData) {
  try {
    const review = {
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    await db.collection(REVIEWS_COLLECTION).doc(id).update(review);
    return { id, ...review };
  } catch (error) {
    console.error('Error actualizando reseña:', error);
    throw error;
  }
}

/**
 * Eliminar reseña
 */
async function deleteReview(id) {
  try {
    await db.collection(REVIEWS_COLLECTION).doc(id).delete();
  } catch (error) {
    console.error('Error eliminando reseña:', error);
    throw error;
  }
}

// ==================== GESTIÓN DE POSTS DE BLOG ====================

/**
 * Obtener todos los posts
 */
async function getPosts() {
  try {
    const snapshot = await db.collection(POSTS_COLLECTION)
      .orderBy('createdAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error obteniendo posts:', error);
    throw error;
  }
}

/**
 * Crear nuevo post
 */
async function createPost(postData) {
  try {
    const id = uuidv4();
    const post = {
      id,
      ...postData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await db.collection(POSTS_COLLECTION).doc(id).set(post);
    return post;
  } catch (error) {
    console.error('Error creando post:', error);
    throw error;
  }
}

/**
 * Actualizar post
 */
async function updatePost(id, updateData) {
  try {
    const post = {
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    await db.collection(POSTS_COLLECTION).doc(id).update(post);
    return { id, ...post };
  } catch (error) {
    console.error('Error actualizando post:', error);
    throw error;
  }
}

/**
 * Eliminar post
 */
async function deletePost(id) {
  try {
    await db.collection(POSTS_COLLECTION).doc(id).delete();
  } catch (error) {
    console.error('Error eliminando post:', error);
    throw error;
  }
}

// ==================== GESTIÓN DE BIBLIOTECA ====================

/**
 * Obtener todos los items de biblioteca
 */
async function getLibraryItems() {
  try {
    const snapshot = await db.collection(LIBRARY_COLLECTION)
      .orderBy('createdAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error obteniendo items de biblioteca:', error);
    throw error;
  }
}

/**
 * Crear nuevo item de biblioteca
 */
async function createLibraryItem(itemData) {
  try {
    const id = uuidv4();
    const item = {
      id,
      ...itemData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await db.collection(LIBRARY_COLLECTION).doc(id).set(item);
    return item;
  } catch (error) {
    console.error('Error creando item de biblioteca:', error);
    throw error;
  }
}

/**
 * Actualizar item de biblioteca
 */
async function updateLibraryItem(id, updateData) {
  try {
    const item = {
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    await db.collection(LIBRARY_COLLECTION).doc(id).update(item);
    return { id, ...item };
  } catch (error) {
    console.error('Error actualizando item de biblioteca:', error);
    throw error;
  }
}

/**
 * Eliminar item de biblioteca
 */
async function deleteLibraryItem(id) {
  try {
    await db.collection(LIBRARY_COLLECTION).doc(id).delete();
  } catch (error) {
    console.error('Error eliminando item de biblioteca:', error);
    throw error;
  }
}

module.exports = {
  searchFanfics,
  getAllFanfics,
  createFanfic,
  createMultipleFanfics,
  checkDuplicateByUrl,
  updateFanfic,
  deleteFanfic,
  getStats,
  // Reseñas
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  // Posts
  getPosts,
  createPost,
  updatePost,
  deletePost,
  // Biblioteca
  getLibraryItems,
  createLibraryItem,
  updateLibraryItem,
  deleteLibraryItem
};
