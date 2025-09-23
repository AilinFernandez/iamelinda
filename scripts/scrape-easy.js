const AO3Scraper = require('./ao3-scraper');
const { CONFIGURACIONES } = require('./scrape-config');

// 🎯 SCRIPT SÚPER FÁCIL PARA SCRAPEAR FANFICS

console.log(`
🕷️ ===== SCRAPER AUTOMÁTICO DE AO3 =====

Opciones disponibles:
1. harryPotter    - Harry Potter fanfics (~100)
2. marvelMCU      - Marvel MCU fanfics (~50)  
3. percyJackson   - Percy Jackson fanfics (~75)
4. twilight       - Twilight fanfics (~50)
5. sherlock       - Sherlock fanfics (~60)
6. custom         - Configuración personalizada

==========================================
`);

async function scrapeFanfics(tipo = 'harryPotter') {
  const scraper = new AO3Scraper();
  
  // Obtener configuración
  const config = CONFIGURACIONES[tipo];
  if (!config) {
    console.error(`❌ Tipo "${tipo}" no encontrado. Usa: harryPotter, marvelMCU, percyJackson, twilight, sherlock, custom`);
    return;
  }

  console.log(`🚀 Scrapeando: ${tipo}`);
  console.log(`📚 Fandom: ${config.fandom}`);
  console.log(`🏷️ Tags: ${config.tags.join(', ') || 'Ninguno'}`);
  console.log(`📄 Páginas: ${config.maxPages}`);
  console.log(`📊 Máximo: ${config.maxResults} fanfics\n`);

  try {
    const fanfics = await scraper.scrapeFanfics(config);
    
    if (fanfics.length === 0) {
      console.log('❌ No se encontraron fanfics');
      return;
    }

    // Guardar con nombre descriptivo
    const timestamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const filename = `fanfics-${tipo}-${timestamp}.csv`;
    
    await scraper.saveToCSV(fanfics, filename);
    
    console.log(`\n🎉 ¡Scraping completado!`);
    console.log(`📁 Archivo: ${filename}`);
    console.log(`📊 Fanfics extraídos: ${fanfics.length}`);
    console.log(`\n📋 Próximo paso:`);
    console.log(`   1. Ve a http://localhost:3000/admin`);
    console.log(`   2. Sube el archivo: ${filename}`);
    console.log(`   3. ¡Disfruta buscando con IA!`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Obtener argumento de línea de comandos o usar default
const tipo = process.argv[2] || 'harryPotter';

// Ejecutar
scrapeFanfics(tipo);
