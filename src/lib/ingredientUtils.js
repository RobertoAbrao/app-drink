// src/lib/ingredientUtils.js
import drinksData from '../drinks.json';

// Função para limpar e normalizar o nome de um ingrediente individual
const normalizeIngredientName = (rawIngredient) => {
  let cleaned = rawIngredient.toLowerCase().trim();

  // 1. Remover prefixos de quantidade, números, frações e unidades comuns.
  //    Tenta capturar padrões como "60 ml de ", "1/2 ", "2 unidades de ", "uma pitada de ", etc.
  //    Também tenta capturar casos como "1 limão" para extrair "limão".
  cleaned = cleaned.replace(
    /^[\d\s/.,½¼¾分之一二三四五六七八九十[\]()-]+(?:º|ª)?\s*(?:cs|ml|l|g|gr|kg|unidade(s)?|un|colher(es)?(?:\sde\s(?:sopa|chá|café|bar))?|xícara(s)?|copo(s)?|dose(s)?|gomo(s)?|fatia(s)?|ramo(s)?|folha(s)?|pitada(s)?|dash(es)?|pedaço(s)?|lata(s)?|garrafa(s)?|cubo(s)?|grão(s)?|tablete(s)?|gota(s)?|sachê(s)?|pacote(s)?|vidro(s)?|dúzia(s)?|lâmina(s)?|talos(s)?|cacho(s)?|punhado(s)?|scoop(s)?|barra(s)?|cabeça(s)?|dente(s)?|ovo(s)?|lim(ão|ões))?\s*(?:de\s+|d[’'])?/i,
    ''
  );

  // 2. Se, após a remoção acima, a string ainda começar com "de ", remove esse "de ".
  //    Ex: Se sobrou "de vodka" após remover "15 ml ", resultará em "vodka".
  if (cleaned.startsWith('de ')) {
    cleaned = cleaned.substring(3).trim();
  }
  
  // 3. Remover algumas descrições comuns no final (ex: fresco, picado)
  //    e informações em parênteses.
  cleaned = cleaned.replace(/\s*\([^)]*\)$/, '').trim(); // Remove (qualquer coisa dentro de parênteses) no final
  const trailingQualifiers = [
    'fresco', 'fresca', 'picado', 'picada', 'ralado', 'ralada', 'cortado em cubos', 'em cubos',
    'em rodelas', 'em pedaços', 'para decorar', 'opcional', 'a gosto', 'batido', 'batida',
    'quente', 'gelado', 'gelada', 'congelado', 'congelada', 'em pó', 'refinado', 'cristal',
    'demerara', 'mascavo', 'branco', 'branca', 'tinto', 'doce', 'seco', 'seca', 'inteiro',
    'inteira', 'espremido', 'espremida', 'filtrado', 'sem semente', 'com casca', 'sem casca',
    'grande', 'pequeno', 'médio'
  ];
  for (const qualifier of trailingQualifiers) {
    const regex = new RegExp(`\\s+${qualifier}$`, 'i');
    cleaned = cleaned.replace(regex, '').trim();
  }

  // Se a limpeza resultar em uma string vazia, retorna vazio para ser filtrado depois.
  if (!cleaned) {
    return '';
  }

  // 4. Capitalizar a primeira letra do nome do ingrediente resultante.
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
};

// Processa a string de ingredientes de cada drink, normalizando cada um
const extractAndNormalizeIngredients = (ingredientsString) => {
  return ingredientsString
    .split(/;|\r?\n|,/) // Separa por ;, quebra de linha ou ,
    .map(i => normalizeIngredientName(i)) // Normaliza cada parte
    .filter(ing => ing && ing.length > 1); // Remove vazios ou muito curtos e garante unicidade de forma case-insensitive
};

let allIngredientsCache = null;
export const getAllIngredients = () => {
  if (allIngredientsCache) {
    return allIngredientsCache;
  }

  const ingredientSet = new Set();
  drinksData.forEach(drink => {
    const ingredients = extractAndNormalizeIngredients(drink.ingredientes); // Usa a nova função
    ingredients.forEach(ing => ingredientSet.add(ing)); // `ing` já está normalizado e capitalizado
  });
  allIngredientsCache = Array.from(ingredientSet).sort();
  return allIngredientsCache;
};

let popularIngredientsCache = null;
export const getPopularIngredients = (topN = 10) => {
  if (popularIngredientsCache) {
    return popularIngredientsCache;
  }

  const ingredientCounts = {};
  drinksData.forEach(drink => {
    const ingredients = extractAndNormalizeIngredients(drink.ingredientes); // Usa a nova função
    ingredients.forEach(ing => {
      // `ing` já está normalizado e capitalizado
      ingredientCounts[ing] = (ingredientCounts[ing] || 0) + 1;
    });
  });

  popularIngredientsCache = Object.entries(ingredientCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, topN)
    .map(([ingredient]) => ingredient);
  return popularIngredientsCache;
};

// ... (função getAllDrinkNames, se estiver neste arquivo)
// Se getAllDrinkNames estiver aqui, ela não precisa de mudanças para este problema específico.
let allDrinkNamesCache = null;
export const getAllDrinkNames = () => {
  if (allDrinkNamesCache) {
    return allDrinkNamesCache;
  }
  allDrinkNamesCache = drinksData.map(drink => drink.nome).sort();
  return allDrinkNamesCache;
};