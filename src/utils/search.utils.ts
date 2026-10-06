import type { Product } from "@/lib/products";

export interface CategorySearchItem {
  id: string;
  name: string;
  slug?: string;
  productCount?: number;
  product_count?: number;
  displayOrder?: number;
}

export interface MatchedCategory {
  id: string;
  name: string;
  slug: string;
  productCount: number;
  score: number;
}

/**
 * Common colloquials, synonyms, and transliterated Tamil/English terms for fireworks
 */
const SYNONYMS: Record<string, string[]> = {
  flowerpot: ["flower", "pot", "flowerpot"],
  flowerpots: ["flower", "pot", "flowerpot"],
  flower: ["flower", "pot", "koti"],
  pot: ["pot", "pots", "flower", "koti", "kotti"],
  pots: ["pot", "pots", "flower", "koti", "kotti"],
  koti: ["pot", "koti", "flower"],
  kotti: ["pot", "koti", "flower"],
  colourpot: ["colour", "pot", "flower"],
  colorpot: ["color", "pot", "flower"],
  chakkar: ["chakkar", "chakkars", "ground", "wheel", "spinner", "chakra"],
  chakkars: ["chakkar", "chakkars", "ground", "wheel", "spinner", "chakra"],
  chakra: ["chakkar", "wheel"],
  wheel: ["chakkar", "wheel"],
  spinner: ["chakkar", "spinner"],
  ground: ["ground", "chakkar"],
  sparkler: ["sparkler", "sparklers", "kambi", "mathappu", "stick"],
  sparklers: ["sparkler", "sparklers", "kambi", "mathappu", "stick"],
  mathappu: ["sparkler", "sparklers"],
  kambi: ["sparkler", "sparklers"],
  matches: ["sparkler", "matches", "match"],
  rocket: ["rocket", "rockets", "sky", "luni"],
  rockets: ["rocket", "rockets", "sky", "luni"],
  bomb: ["bomb", "bombs", "atom", "hydro", "sound", "bijili", "lakshmi", "laxmi", "vedi"],
  bombs: ["bomb", "bombs", "atom", "hydro", "sound", "bijili", "lakshmi", "laxmi", "vedi"],
  atom: ["bomb", "atom"],
  bijili: ["bijili", "bomb", "sound", "cracker"],
  lakshmi: ["lakshmi", "laxmi", "bomb"],
  laxmi: ["lakshmi", "laxmi", "bomb"],
  skyshot: ["sky", "shot", "shots", "aerial", "fancy"],
  skyshots: ["sky", "shot", "shots", "aerial", "fancy"],
  shot: ["shot", "shots", "sky", "aerial", "fancy", "candle", "pipe"],
  shots: ["shot", "shots", "sky", "aerial", "fancy", "candle", "pipe"],
  fancy: ["fancy", "shot", "aerial", "fountain"],
  aerial: ["aerial", "sky", "shot"],
  fountain: ["fountain", "fountains", "tin", "fountain"],
  fountains: ["fountain", "fountains", "tin"],
  garland: ["garland", "saravedi", "ladi", "wala", "chorsa"],
  saravedi: ["garland", "saravedi", "ladi", "wala"],
  ladi: ["garland", "ladi", "saravedi"],
  wala: ["garland", "wala", "saravedi"],
  sound: ["sound", "bomb", "bijili"],
  kids: ["kids", "children", "magic", "pop", "cap", "novelty"],
  magic: ["magic", "kids", "pop"],
  roll: ["roll", "cap", "kids"],
  cap: ["cap", "roll", "kids"],
};


export function normalizeWord(word: string): string {
  let w = word.toLowerCase().trim().replace(/[^a-z0-9]/g, "");
  if (w.endsWith("ies") && w.length > 4) {
    w = w.slice(0, -3) + "y";
  } else if (w.endsWith("es") && (w.endsWith("ches") || w.endsWith("shes") || w.endsWith("xes"))) {
    w = w.slice(0, -2);
  } else if (w.endsWith("s") && !w.endsWith("ss") && w.length > 3) {
    w = w.slice(0, -1);
  }
  return w;
}


export function extractQueryTokens(rawQuery: string): {
  tokens: string[];
  allVariations: string[];
} {
  const clean = rawQuery.toLowerCase().trim();
  if (!clean) return { tokens: [], allVariations: [] };

  let expanded = clean;
  if (expanded.includes("flowerpot")) expanded = expanded.replace(/flowerpot/g, "flower pot");
  if (expanded.includes("skyshot")) expanded = expanded.replace(/skyshot/g, "sky shot");
  if (expanded.includes("groundchakkar")) expanded = expanded.replace(/groundchakkar/g, "ground chakkar");
  if (expanded.includes("atombomb")) expanded = expanded.replace(/atombomb/g, "atom bomb");

  const rawWords = expanded
    .split(/[\s,/\-_+]+/)
    .map((w) => w.trim().replace(/[^a-z0-9]/g, ""))
    .filter((w) => w.length > 0);

  const tokens = Array.from(new Set(rawWords.map(normalizeWord)));

  const variationsSet = new Set<string>();
  tokens.forEach((t) => {
    variationsSet.add(t);
    variationsSet.add(t + "s");
    if (t.endsWith("s") && t.length > 3) {
      variationsSet.add(t.slice(0, -1));
    }
    if (SYNONYMS[t]) {
      SYNONYMS[t].forEach((syn) => variationsSet.add(syn));
    }
  });

  return {
    tokens,
    allVariations: Array.from(variationsSet),
  };
}

/**
 * Searches and scores matching categories.
 */
export function searchCategories(
  rawQuery: string,
  categories: CategorySearchItem[]
): MatchedCategory[] {
  const clean = rawQuery.toLowerCase().trim();
  if (!clean || categories.length === 0) return [];

  const { tokens, allVariations } = extractQueryTokens(rawQuery);
  if (tokens.length === 0) return [];

  const matched: MatchedCategory[] = [];

  for (const cat of categories) {
    const catName = cat.name.toLowerCase();
    const catWords = catName
      .split(/[\s,/\-_+]+/)
      .map(normalizeWord)
      .filter((w) => w.length > 0);

    let score = 0;

    // Exact category name match
    if (catName === clean) {
      score += 1000;
    } else if (catName.startsWith(clean)) {
      score += 700;
    } else if (catName.includes(clean)) {
      score += 500;
    }

    let matchedTokenCount = 0;
    for (const token of tokens) {
      const tokenMatched =
        catWords.some((cw) => cw === token || cw.includes(token) || token.includes(cw)) ||
        catName.includes(token);
      if (tokenMatched) {
        matchedTokenCount += 1;
        score += 250;
      }
    }

    for (const v of allVariations) {
      if (catName.includes(v)) {
        score += 80;
      }
    }

    if (tokens.length > 0 && matchedTokenCount === tokens.length) {
      score += 400;
    }

    if (score > 0) {
      matched.push({
        id: cat.id,
        name: cat.name,
        slug: cat.slug || cat.id,
        productCount: cat.productCount ?? cat.product_count ?? 0,
        score,
      });
    }
  }

  return matched.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.name.localeCompare(b.name);
  });
}


export function searchProducts(
  rawQuery: string,
  products: Product[],
  matchedCategories: MatchedCategory[] = []
): Product[] {
  const clean = rawQuery.toLowerCase().trim();
  if (!clean || products.length === 0) return [];

  const { tokens, allVariations } = extractQueryTokens(rawQuery);
  if (tokens.length === 0) return [];

  const matchedCatIds = new Set(matchedCategories.map((c) => c.id));
  const matchedCatNames = new Set(
    matchedCategories.map((c) => c.name.toLowerCase().trim())
  );

  const scored: { product: Product; score: number }[] = [];

  for (const p of products) {
    const name = p.name.toLowerCase();
    const catName = (p.category_name || "").toLowerCase();
    const desc = (p.description || "").toLowerCase();
    const sku = (p.sku || "").toLowerCase();

    const nameWords = name
      .split(/[\s,/\-_+]+/)
      .map(normalizeWord)
      .filter((w) => w.length > 0);

    let score = 0;

    if (name === clean) {
      score += 1500;
    } else if (name.startsWith(clean)) {
      score += 800;
    } else if (name.includes(clean)) {
      score += 600;
    }

    if (
      (p.category_id && matchedCatIds.has(p.category_id)) ||
      matchedCatNames.has(catName)
    ) {
      score += 450;
    }

    if (catName === clean) {
      score += 600;
    } else if (catName.includes(clean)) {
      score += 400;
    }

    let tokensInName = 0;
    for (const t of tokens) {
      const inWords = nameWords.some(
        (nw) => nw === t || nw.startsWith(t) || t.startsWith(nw)
      );
      const inRawName = name.includes(t);

      if (inWords || inRawName) {
        tokensInName += 1;
        score += 250;
      }
    }

    if (tokens.length > 1 && tokensInName === tokens.length) {
      score += 400;
    }

    let tokensInCat = 0;
    for (const t of tokens) {
      if (catName.includes(t)) {
        tokensInCat += 1;
        score += 180;
      }
    }
    if (tokens.length > 1 && tokensInCat === tokens.length) {
      score += 300;
    }

    if (tokens.length > 1 && tokensInName + tokensInCat >= tokens.length) {
      score += 200;
    }

    for (const v of allVariations) {
      if (name.includes(v)) score += 60;
      if (catName.includes(v)) score += 50;
    }

    if (sku.includes(clean)) score += 300;
    for (const t of tokens) {
      if (desc.includes(t)) score += 40;
    }
    if (p.is_best_seller) score += 30;
    if (p.is_trending) score += 20;
    if (p.rating) score += Math.round(p.rating * 5);

    if (score > 0) {
      scored.push({ product: p, score });
    }
  }

  return scored
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const orderA = a.product.display_order ?? 999;
      const orderB = b.product.display_order ?? 999;
      if (orderA !== orderB) return orderA - orderB;
      return a.product.name.localeCompare(b.product.name);
    })
    .map((s) => s.product);
}
