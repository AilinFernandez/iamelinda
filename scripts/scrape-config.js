// 🕷️ CONFIGURACIÓN DEL SCRAPER AO3
// Modifica estos valores según lo que quieras scrapear

const CONFIGURACIONES = {
  // === BÚSQUEDAS POPULARES ===
  
  harryPotter: {
    fandom: 'Harry Potter - J. K. Rowling',
    tags: ['Alternate Universe', 'Harry Potter/Draco Malfoy'], 
    maxPages: 5,
    maxResults: 100
  },

  marvelMCU: {
    fandom: 'Marvel Cinematic Universe',
    tags: ['Tony Stark/Steve Rogers', 'Alternate Universe'],
    maxPages: 3,
    maxResults: 50
  },

  percyJackson: {
    fandom: 'Percy Jackson and the Olympians - Rick Riordan',
    tags: ['Alternate Universe', 'Romance'],
    maxPages: 4,
    maxResults: 75
  },

  twilight: {
    fandom: 'Twilight Series - Stephenie Meyer',
    tags: ['Edward Cullen/Bella Swan', 'Alternate Universe'],
    maxPages: 3,
    maxResults: 50
  },

  sherlock: {
    fandom: 'Sherlock (TV)',
    tags: ['Sherlock Holmes/John Watson', 'Case Fic'],
    maxPages: 4,
    maxResults: 60
  },

  // === CONFIGURACIÓN PERSONALIZADA ===
  custom: {
    fandom: '', // Pon aquí el fandom que quieras
    tags: [], // Pon tags específicos como ['Romance', 'Fluff', 'Hurt/Comfort']
    rating: '', // Vacío para todos, o '10' para Teen, '11' para Mature, etc.
    status: '', // Vacío para todos, 'T' para solo completos
    maxPages: 2, // Número de páginas (cada página = ~20 fanfics)
    maxResults: 40 // Máximo total de fanfics
  },

  // === EJEMPLOS DE BÚSQUEDAS ESPECÍFICAS ===
  
  // Solo Harry Potter completos y Teen
  harryPotterCompletos: {
    fandom: 'Harry Potter - J. K. Rowling',
    tags: ['Complete Work'],
    rating: '10', // Teen And Up Audiences
    status: 'T', // Solo completos
    maxPages: 3,
    maxResults: 60
  },

  // Solo romance fluff
  romanceFluff: {
    fandom: 'Harry Potter - J. K. Rowling',
    tags: ['Romance', 'Fluff', 'Happy Ending'],
    maxPages: 2,
    maxResults: 40
  },

  // Enemies to lovers
  enemiesToLovers: {
    fandom: 'Harry Potter - J. K. Rowling', 
    tags: ['Enemies to Lovers', 'Harry Potter/Draco Malfoy'],
    maxPages: 3,
    maxResults: 50
  }
};

// === FANDOMS POPULARES EN AO3 ===
const FANDOMS_POPULARES = [
  'Harry Potter - J. K. Rowling',
  'Marvel Cinematic Universe',
  '僕のヒーローアカデミア | Boku no Hero Academia | My Hero Academia',
  'Sherlock (TV)',
  'Supernatural',
  'Naruto',
  'Attack on Titan',
  'The Witcher (TV)',
  'Good Omens (TV)',
  'Star Wars',
  'Percy Jackson and the Olympians - Rick Riordan',
  'Twilight Series - Stephenie Meyer',
  'Avatar: The Last Airbender',
  'Dream SMP',
  'Original Work'
];

// === TAGS POPULARES ===
const TAGS_POPULARES = [
  'Alternate Universe',
  'Fluff',
  'Angst',
  'Romance',
  'Hurt/Comfort',
  'Enemies to Lovers',
  'Friends to Lovers',
  'Slow Burn',
  'Happy Ending',
  'Fix-It',
  'Time Travel',
  'Soulmates',
  'Coffee Shop AU',
  'College/University',
  'Modern AU'
];

module.exports = {
  CONFIGURACIONES,
  FANDOMS_POPULARES,
  TAGS_POPULARES
};
