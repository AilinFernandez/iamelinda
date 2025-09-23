const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

class AO3Scraper {
  constructor() {
    this.baseUrl = 'https://archiveofourown.org';
    this.delay = 2000; // 2 segundos entre requests para ser respetuosos
  }

  // Función para hacer pausa entre requests
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Scraper principal
  async scrapeFanfics(searchCriteria) {
    const {
      fandom = '',
      tags = [],
      rating = '',
      status = '',
      maxPages = 5,
      maxResults = 100
    } = searchCriteria;

    console.log(`🕷️ Iniciando scraping de AO3...`);
    console.log(`📚 Fandom: ${fandom}`);
    console.log(`📄 Páginas máximas: ${maxPages}`);
    console.log(`📊 Resultados máximos: ${maxResults}`);

    const allFanfics = [];
    
    for (let page = 1; page <= maxPages; page++) {
      if (allFanfics.length >= maxResults) break;

      console.log(`\n📄 Procesando página ${page}...`);
      
      try {
        const pageResults = await this.scrapePage(fandom, tags, rating, status, page);
        
        if (pageResults.length === 0) {
          console.log('❌ No hay más resultados, terminando...');
          break;
        }

        allFanfics.push(...pageResults);
        console.log(`✅ Encontrados ${pageResults.length} fanfics en página ${page}`);
        console.log(`📊 Total acumulado: ${allFanfics.length}`);

        // Pausa entre páginas
        if (page < maxPages) {
          console.log(`⏳ Esperando ${this.delay/1000}s antes de la siguiente página...`);
          await this.sleep(this.delay);
        }

      } catch (error) {
        console.error(`❌ Error en página ${page}:`, error.message);
        // Continuar con la siguiente página
      }
    }

    return allFanfics.slice(0, maxResults);
  }

  // Scrapear una página específica
  async scrapePage(fandom, tags, rating, status, page) {
    const searchUrl = this.buildSearchUrl(fandom, tags, rating, status, page);
    
    try {
      const response = await axios.get(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      const $ = cheerio.load(response.data);
      const fanfics = [];

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
      console.error('Error fetching page:', error.message);
      return [];
    }
  }

  // Construir URL de búsqueda
  buildSearchUrl(fandom, tags, rating, status, page) {
    const params = new URLSearchParams();
    
    // Búsqueda básica
    if (fandom) {
      params.append('work_search[fandom_names]', fandom);
    }
    
    // Tags adicionales
    if (tags.length > 0) {
      params.append('work_search[other_tag_names]', tags.join(','));
    }
    
    // Rating
    if (rating) {
      params.append('work_search[rating_ids]', rating);
    }
    
    // Estado
    if (status) {
      params.append('work_search[complete]', status);
    }
    
    // Ordenar por más recientes
    params.append('work_search[sort_column]', 'revised_at');
    params.append('work_search[sort_direction]', 'desc');
    
    // Página
    params.append('page', page.toString());

    return `${this.baseUrl}/works/search?${params.toString()}`;
  }

  // Parsear un fanfic individual
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

    return {
      titulo,
      autor,
      resumen,
      etiquetas: etiquetas.slice(0, 20), // Limitar etiquetas
      advertencias,
      enlace
    };
  }

  // Guardar resultados en CSV
  async saveToCSV(fanfics, filename) {
    const csvHeader = 'Titulo,Autor,Resumen,Etiquetas,Advertencias,Enlace\n';
    
    const csvRows = fanfics.map(fanfic => {
      const escapeCsv = (str) => {
        if (!str) return '""';
        // Escapar comillas y envolver en comillas
        return '"' + str.toString().replace(/"/g, '""') + '"';
      };

      return [
        escapeCsv(fanfic.titulo),
        escapeCsv(fanfic.autor),
        escapeCsv(fanfic.resumen),
        escapeCsv(fanfic.etiquetas.join(', ')),
        escapeCsv(fanfic.advertencias),
        escapeCsv(fanfic.enlace)
      ].join(',');
    });

    const csvContent = csvHeader + csvRows.join('\n');
    
    fs.writeFileSync(filename, csvContent, 'utf8');
    console.log(`💾 Guardado en: ${filename}`);
  }
}

// Función principal
async function main() {
  const scraper = new AO3Scraper();

  // Configuración de búsqueda - PERSONALIZA ESTO
  const searchCriteria = {
    fandom: 'Harry Potter - J. K. Rowling', // Cambia por el fandom que quieras
    tags: [], // Puedes agregar tags específicos como ['Alternate Universe', 'Romance']
    rating: '', // Vacío para todos, o específico como '10' para Teen And Up
    status: '', // Vacío para todos, 'T' para completos
    maxPages: 3, // Número de páginas a scrapear
    maxResults: 50 // Máximo número de fanfics
  };

  try {
    console.log('🚀 Iniciando scraper de AO3...\n');
    
    const fanfics = await scraper.scrapeFanfics(searchCriteria);
    
    if (fanfics.length === 0) {
      console.log('❌ No se encontraron fanfics');
      return;
    }

    console.log(`\n✅ Scraping completado: ${fanfics.length} fanfics encontrados`);
    
    // Guardar en CSV
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
    const filename = `fanfics-scraped-${timestamp}.csv`;
    
    await scraper.saveToCSV(fanfics, filename);
    
    console.log(`\n🎉 ¡Proceso completado!`);
    console.log(`📁 Archivo: ${filename}`);
    console.log(`📊 Total fanfics: ${fanfics.length}`);
    console.log(`\n💡 Ahora puedes subir este CSV en tu panel de admin: http://localhost:3000/admin`);

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Exportar para uso en otros scripts
module.exports = AO3Scraper;

// Ejecutar si se llama directamente
if (require.main === module) {
  main();
}
