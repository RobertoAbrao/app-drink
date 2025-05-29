import Fuse from 'fuse.js';
import drinks from '../drinks.json';

// Configura Fuse.js para fuzzy search no campo `nome` (se quiser usar outro lugar)  
const fuse = new Fuse(drinks, {
  keys: ['nome'],
  threshold: 0.3,
  ignoreLocation: true,
});

/**
 * Retorna o drink que mais casa com os ingredientes passados.
 * Se não houver nenhuma coincidência, retorna null.
 * @param {string[]} ingredients — lista de ingredientes fornecidos pelo usuário
 * @returns {Promise<object|null>}
 */
export async function generateDrink(ingredients) {
  const ingLower = ingredients.map(i => i.trim().toLowerCase());

  const scored = drinks.map(d => {
    const drinkIngs = d.ingredientes
      .split(/;|\r?\n|,/)
      .map(i => i.trim().toLowerCase())
      .filter(Boolean);

    const matchCount = drinkIngs.reduce((count, drinkIng) => {
      return count + (ingLower.some(userIng => drinkIng.includes(userIng)) ? 1 : 0);
    }, 0);

    return { drink: d, score: matchCount };
  });

  scored.sort((a, b) => b.score - a.score);

  if (scored.length === 0 || scored[0].score === 0) {
    return {
      name: 'Nenhum drink encontrado',
      description: 'Nenhuma receita combina com os ingredientes fornecidos.',
      ingredients: [],
      instructions: ['Tente adicionar outros ingredientes ou revise os nomes.'],
      alcoholContent: '',
      difficulty: '',
    };
  }

  const match = scored[0].drink;
  const drinkIngredientsList = match.ingredientes
    .split(/;|\r?\n|,/)      
    .map(i => i.trim())
    .filter(Boolean);

  const instructions = match.modo_preparo
    .split(/\. ?/)   
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => s.endsWith('.') ? s : s + '.');

  return {
    name: match.nome,
    description: `Um drink delicioso feito com ${match.nome}.`,
    ingredients: drinkIngredientsList,
    instructions,
    alcoholContent: containsAlcohol(match.ingredientes) ? 'Alcoólico' : 'Sem álcool',
    difficulty: match.difficulty || 'Fácil',
  };
}


/**
 * Gera receita via busca fuzzy pelo nome.
 * @param {string} query — nome aproximado da bebida
 * @returns {Promise<object|null>}
 */
export async function generateRecipe(query) {
  const key = query.trim();
  const results = fuse.search(key);
  if (results.length === 0) {
    return null;
  }

  const match = results[0].item;
  const ingredients = match.ingredientes
    .split(/;|\r?\n|,/)  
    .map(i => i.trim())
    .filter(Boolean);

  const instructions = match.modo_preparo
    .split(/\. ?/)  
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => s.endsWith('.') ? s : s + '.');

  return {
    title: match.nome,
    description: `Receita de ${match.nome}`,
    ingredients,
    instructions,
    prepTime: match.prepTime,
    difficulty: match.difficulty,
  };
}


function containsAlcohol(ingredientesText) {
  const alcoholicKeywords = [
    'vodka', 'rum', 'tequila', 'gin', 'whisky', 'whiskey',
    'cachaça', 'cachaca', 'licor', 'vermouth', 'vermute',
    'campari', 'sambuca', 'conhaque', 'triple sec', 'amaretto', 'curaçao', 'baileys', 'bourbon', 'brandy'
  ];

  return alcoholicKeywords.some(keyword =>
    ingredientesText.toLowerCase().includes(keyword)
  );
}
