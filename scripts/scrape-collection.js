const AO3CollectionScraper = require('./collection-scraper');

// 🎯 SCRIPT PARA SCRAPEAR COLECCIONES DE AO3

console.log(`
🗂️ ===== SCRAPER DE COLECCIONES AO3 =====

Ejemplos de URLs de colecciones:
• https://archiveofourown.org/collections/nombre_coleccion
• https://archiveofourown.org/collections/nombre_coleccion/works

==========================================
`);

async function scrapeCollection(collectionUrl, maxResults = 100) {
  if (!collectionUrl) {
    console.error(`❌ Debes proporcionar una URL de colección.
    
Uso: node scripts/scrape-collection.js "https://archiveofourown.org/collections/nombre_coleccion"

Ejemplos de colecciones populares:
• https://archiveofourown.org/collections/yuletide2023
• https://archiveofourown.org/collections/hpfemslash_minifest
• https://archiveofourown.org/collections/drarrymicrofic
`);
    return;
  }

  console.log(`🚀 Scrapeando colección...`);
  console.log(`🔗 URL: ${collectionUrl}`);
  console.log(`📊 Máximo: ${maxResults} fanfics\n`);

  const scraper = new AO3CollectionScraper();

  try {
    const fanfics = await scraper.scrapeCollection(collectionUrl, maxResults);
    
    if (fanfics.length === 0) {
      console.log('❌ No se encontraron fanfics en esta colección');
      console.log('💡 Verifica que la URL sea correcta y que la colección tenga obras públicas');
      return;
    }

    // Guardar con nombre descriptivo
    const timestamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const collectionId = scraper.extractCollectionId(collectionUrl);
    const filename = `collection-${collectionId}-${timestamp}.csv`;
    
    await scraper.saveToCSV(fanfics, filename);
    
    console.log(`\n🎉 ¡Scraping completado!`);
    console.log(`📁 Archivo: ${filename}`);
    console.log(`📊 Fanfics extraídos: ${fanfics.length}`);
    console.log(`\n📋 Próximo paso:`);
    console.log(`   1. Ve a http://localhost:3000/admin`);
    console.log(`   2. Sube el archivo: ${filename}`);
    console.log(`   3. ¡Disfruta buscando con IA!`);

    // Mostrar algunas estadísticas
    console.log(`\n📈 Estadísticas:`);
    const autores = new Set(fanfics.map(f => f.autor)).size;
    const fandoms = new Set(fanfics.flatMap(f => f.etiquetas.filter(e => e.includes(' - ')))).size;
    console.log(`   👥 Autores únicos: ${autores}`);
    console.log(`   📚 Fandoms diferentes: ${fandoms}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('URL de colección no válida')) {
      console.log('\n💡 Formato correcto:');
      console.log('   https://archiveofourown.org/collections/nombre_coleccion');
    }
  }
}

// Obtener URL de línea de comandos
const collectionUrl = process.argv[2];
const maxResults = parseInt(process.argv[3]) || 100;

// Ejecutar
scrapeCollection(collectionUrl, maxResults);
