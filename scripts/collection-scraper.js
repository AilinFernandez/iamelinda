const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

class AO3CollectionScraper {
  constructor() {
    this.baseUrl = 'https://archiveofourown.org';
    this.delay = 3000; // 3 segundos entre requests (más conservador)
    this.maxRetries = 3; // Intentos máximos por página
  }

  // Función para hacer pausa entre requests
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Extraer ID de colección desde URL
  extractCollectionId(collectionUrl) {
    // Ejemplos de URLs válidas:
    // https://archiveofourown.org/collections/collection_name
    // https://archiveofourown.org/collections/collection_name/works
    // https://archiveofourown.org/collections/collection_name/profile
    
    const regex = /collections\/([^\/\?]+)/;
    const match = collectionUrl.match(regex);
    
    if (!match) {
      throw new Error('URL de colección no válida. Formato esperado: https://archiveofourown.org/collections/nombre_coleccion');
    }
    
    return match[1];
  }

  // Scraper principal para colecciones
  async scrapeCollection(collectionUrl, maxResults = 100) {
    try {
      const collectionId = this.extractCollectionId(collectionUrl);
      
      console.log(`🕷️ Scrapeando colección: ${collectionId}`);
      console.log(`🔗 URL: ${collectionUrl}`);
      console.log(`📊 Máximo: ${maxResults} fanfics\n`);

      // Primero obtener info de la colección
      const collectionInfo = await this.getCollectionInfo(collectionId);
      console.log(`📚 Colección: "${collectionInfo.title}"`);
      console.log(`👤 Por: ${collectionInfo.maintainers}`);
      console.log(`📄 Descripción: ${collectionInfo.description}\n`);

      const allFanfics = [];
      let page = 1;
      let hasMorePages = true;

      while (hasMorePages && allFanfics.length < maxResults) {
        console.log(`📄 Procesando página ${page}...`);
        
        try {
          const pageResults = await this.scrapeCollectionPage(collectionId, page);
          
          if (pageResults.length === 0) {
            console.log('❌ No hay más fanfics en esta página, terminando...');
            hasMorePages = false;
            break;
          }

          // Agregar info de la colección a cada fanfic
          const fanficsWithCollection = pageResults.map(fanfic => ({
            ...fanfic,
            coleccion: collectionInfo.title,
            coleccion_url: collectionUrl
          }));

          allFanfics.push(...fanficsWithCollection);
          console.log(`✅ Encontrados ${pageResults.length} fanfics en página ${page}`);
          console.log(`📊 Total acumulado: ${allFanfics.length}`);

          // Pausa entre páginas
          if (hasMorePages && allFanfics.length < maxResults) {
            console.log(`⏳ Esperando ${this.delay/1000}s antes de la siguiente página...`);
            await this.sleep(this.delay);
          }

          page++;

        } catch (error) {
          console.error(`❌ Error en página ${page}:`, error.message);
          if (error.message.includes('404') || error.message.includes('not found')) {
            hasMorePages = false;
          }
          break;
        }
      }

      return allFanfics.slice(0, maxResults);

    } catch (error) {
      console.error('❌ Error scrapeando colección:', error.message);
      throw error;
    }
  }

  // Obtener información de la colección
  async getCollectionInfo(collectionId) {
    const collectionUrl = `${this.baseUrl}/collections/${collectionId}`;
    
    try {
      const response = await axios.get(collectionUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const $ = cheerio.load(response.data);
      
      const title = $('h2.heading').first().text().trim() || collectionId;
      const description = $('.collection .userstuff').text().trim() || 'Sin descripción';
      const maintainers = $('.collection .meta dd a').map((i, el) => $(el).text().trim()).get().join(', ') || 'Desconocido';

      return {
        title,
        description: description.substring(0, 200) + (description.length > 200 ? '...' : ''),
        maintainers
      };

    } catch (error) {
      console.error('Error obteniendo info de colección:', error.message);
      return {
        title: collectionId,
        description: 'Información no disponible',
        maintainers: 'Desconocido'
      };
    }
  }

  // Scrapear una página específica de la colección con reintentos
  async scrapeCollectionPage(collectionId, page) {
    const worksUrl = `${this.baseUrl}/collections/${collectionId}/works?page=${page}`;
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        console.log(`   🔄 Intento ${attempt}/${this.maxRetries}...`);
        
        const response = await axios.get(worksUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
          },
          timeout: 15000 // 15 segundos timeout
        });

        const $ = cheerio.load(response.data);
        const fanfics = [];

        // Verificar si hay obras
        if ($('li.work').length === 0) {
          return [];
        }

        $('li.work').each((i, element) => {
          try {
            const fanfic = this.parseFanfic($, element);
            if (fanfic) {
              fanfics.push(fanfic);
            }
          } catch (error) {
            console.error(`Error parseando fanfic ${i}:`, error.message);
          }
        });

        return fanfics;

      } catch (error) {
        console.log(`   ❌ Intento ${attempt} falló: ${error.message}`);
        
        if (error.response && error.response.status === 404) {
          throw new Error('Página no encontrada - fin de la colección');
        }
        
        if (attempt === this.maxRetries) {
          console.error(`   ❌ Todos los intentos fallaron para página ${page}`);
          return [];
        }
        
        // Esperar más tiempo antes del siguiente intento
        const waitTime = this.delay * attempt;
        console.log(`   ⏳ Esperando ${waitTime/1000}s antes del siguiente intento...`);
        await this.sleep(waitTime);
      }
    }
    
    return []; // Si todos los intentos fallan
  }

  // Parsear un fanfic individual (igual que el scraper normal)
  parseFanfic($, element) {
    const $work = $(element);

    // Título y URL
    const titleElement = $work.find('h4.heading a').first();
    const titulo = titleElement.text().trim();
    const enlace = this.baseUrl + titleElement.attr('href');

    if (!titulo || !enlace) return null;

    // Autor
    const autor = $work.find('a[rel="author"]').first().text().trim() || 'Anonymous';

    // Fandom
    const fandomElements = $work.find('h5.fandoms a');
    const fandoms = [];
    fandomElements.each((i, el) => {
      fandoms.push($(el).text().trim());
    });

    // Resumen
    const resumen = $work.find('blockquote.userstuff').text().trim();

    // Etiquetas
    const etiquetas = [];
    
    // Agregar fandoms
    etiquetas.push(...fandoms);
    
    // Agregar tags adicionales
    $work.find('ul.tags a.tag').each((i, el) => {
      const tag = $(el).text().trim();
      if (tag && !etiquetas.includes(tag)) {
        etiquetas.push(tag);
      }
    });

    // Personajes
    $work.find('ul.characters a').each((i, el) => {
      const char = $(el).text().trim();
      if (char && !etiquetas.includes(char)) {
        etiquetas.push(char);
      }
    });

    // Relaciones
    $work.find('ul.relationships a').each((i, el) => {
      const rel = $(el).text().trim();
      if (rel && !etiquetas.includes(rel)) {
        etiquetas.push(rel);
      }
    });

    // Advertencias
    let advertencias = 'Advertencias no encontradas';
    const warningElement = $work.find('.warnings');
    if (warningElement.length > 0) {
      advertencias = warningElement.text().trim();
    }

    // Stats adicionales
    const stats = $work.find('.stats');
    const words = stats.find('dd.words').text().trim();
    const chapters = stats.find('dd.chapters').text().trim();
    const kudos = stats.find('dd.kudos').text().trim();

    return {
      titulo,
      autor,
      resumen,
      etiquetas: etiquetas.slice(0, 20), // Limitar etiquetas
      advertencias,
      enlace,
      palabras: words || 'N/A',
      capitulos: chapters || 'N/A',
      kudos: kudos || 'N/A'
    };
  }

  // Guardar resultados en CSV
  async saveToCSV(fanfics, filename) {
    const csvHeader = 'Titulo,Autor,Resumen,Etiquetas,Advertencias,Enlace,Coleccion,Palabras,Capitulos,Kudos\n';
    
    const csvRows = fanfics.map(fanfic => {
      const escapeCsv = (str) => {
        if (!str) return '""';
        return '"' + str.toString().replace(/"/g, '""') + '"';
      };

      return [
        escapeCsv(fanfic.titulo),
        escapeCsv(fanfic.autor),
        escapeCsv(fanfic.resumen),
        escapeCsv(fanfic.etiquetas.join(', ')),
        escapeCsv(fanfic.advertencias),
        escapeCsv(fanfic.enlace),
        escapeCsv(fanfic.coleccion || ''),
        escapeCsv(fanfic.palabras || ''),
        escapeCsv(fanfic.capitulos || ''),
        escapeCsv(fanfic.kudos || '')
      ].join(',');
    });

    const csvContent = csvHeader + csvRows.join('\n');
    
    fs.writeFileSync(filename, csvContent, 'utf8');
    console.log(`💾 Guardado en: ${filename}`);
  }
}

// Función principal
async function main() {
  // CONFIGURA AQUÍ TU COLECCIÓN
  const COLLECTION_URL = 'https://archiveofourown.org/collections/ejemplo'; // ← CAMBIA ESTO
  const MAX_RESULTS = 100; // Máximo número de fanfics a extraer

  const scraper = new AO3CollectionScraper();

  try {
    console.log('🚀 Iniciando scraper de colección AO3...\n');
    
    const fanfics = await scraper.scrapeCollection(COLLECTION_URL, MAX_RESULTS);
    
    if (fanfics.length === 0) {
      console.log('❌ No se encontraron fanfics en esta colección');
      return;
    }

    console.log(`\n✅ Scraping completado: ${fanfics.length} fanfics encontrados`);
    
    // Guardar en CSV
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
    const collectionId = scraper.extractCollectionId(COLLECTION_URL);
    const filename = `collection-${collectionId}-${timestamp}.csv`;
    
    await scraper.saveToCSV(fanfics, filename);
    
    console.log(`\n🎉 ¡Proceso completado!`);
    console.log(`📁 Archivo: ${filename}`);
    console.log(`📊 Total fanfics: ${fanfics.length}`);
    console.log(`\n💡 Ahora puedes subir este CSV en tu panel de admin: http://localhost:3000/admin`);

  } catch (error) {
    console.error('❌ Error general:', error.message);
    console.log('\n💡 Ejemplos de URLs válidas:');
    console.log('   https://archiveofourown.org/collections/nombre_coleccion');
    console.log('   https://archiveofourown.org/collections/nombre_coleccion/works');
  }
}

// Exportar para uso en otros scripts
module.exports = AO3CollectionScraper;

// Ejecutar si se llama directamente
if (require.main === module) {
  main();
}
