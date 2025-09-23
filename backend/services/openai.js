const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Procesa una consulta de búsqueda y extrae criterios relevantes
 */
async function processSearchQuery(userQuery) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Eres un asistente especializado en recomendar fanfics. Analiza la consulta del usuario y extrae información relevante para buscar en una base de datos de fanfics.

Los fanfics tienen estos campos: titulo, autor, resumen, etiquetas, advertencias, enlace.

Extrae y devuelve en formato JSON:
{
  "fandom": "fandom principal si se menciona",
  "characters": ["personajes mencionados"],
  "relationships": ["relaciones mencionadas"],
  "genres": ["géneros como romance, drama, etc."],
  "tropes": ["tropos como enemies to lovers, etc."],
  "keywords": ["palabras clave para buscar"],
  "processed_query": "descripción en lenguaje natural de lo que busca"
}`
        },
        {
          role: "user",
          content: `Analiza esta consulta: "${userQuery}"`
        }
      ],
      temperature: 0.3,
      max_tokens: 400
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('Error procesando consulta con OpenAI:', error);
    return {
      fandom: null,
      characters: [],
      relationships: [],
      genres: [],
      tropes: [],
      keywords: [userQuery],
      processed_query: userQuery
    };
  }
}

/**
 * Genera una explicación de por qué se recomiendan estos fanfics
 */
async function generateRecommendationExplanation(fanfics, userQuery, searchCriteria) {
  try {
    if (!fanfics || fanfics.length === 0) {
      return "No se encontraron fanfics que coincidan con tu búsqueda.";
    }

    const fanficsInfo = fanfics.slice(0, 3).map(f => ({
      titulo: f.titulo,
      autor: f.autor,
      resumen: f.resumen?.substring(0, 200) || '',
      etiquetas: f.etiquetas?.slice(0, 5) || []
    }));

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Eres un experto en fanfics. Explica por qué estos fanfics son relevantes para la consulta del usuario. Sé específico sobre qué elementos coinciden. Responde en español de manera natural y entusiasta."
        },
        {
          role: "user",
          content: `Consulta del usuario: "${userQuery}"

Criterios extraídos: ${JSON.stringify(searchCriteria, null, 2)}

Fanfics encontrados:
${JSON.stringify(fanficsInfo, null, 2)}

Explica por qué estos fanfics son perfectos para lo que busca el usuario.`
        }
      ],
      temperature: 0.7,
      max_tokens: 300
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generando explicación:', error);
    return `Se encontraron ${fanfics.length} fanfics que coinciden con tu búsqueda.`;
  }
}

/**
 * Genera sugerencias de búsqueda relacionadas
 */
async function generateSearchSuggestions(userQuery, searchCriteria) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Basándote en la consulta del usuario, sugiere 4-5 búsquedas relacionadas que podrían interesarle. Varía los géneros, tropos y elementos. Responde solo con las sugerencias, una por línea."
        },
        {
          role: "user",
          content: `Consulta original: "${userQuery}"
Criterios: ${JSON.stringify(searchCriteria, null, 2)}

Sugiere búsquedas relacionadas:`
        }
      ],
      temperature: 0.8,
      max_tokens: 200
    });

    const suggestions = response.choices[0].message.content
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .slice(0, 5);

    return suggestions;
  } catch (error) {
    console.error('Error generando sugerencias:', error);
    return [];
  }
}

module.exports = {
  processSearchQuery,
  generateRecommendationExplanation,
  generateSearchSuggestions
};
