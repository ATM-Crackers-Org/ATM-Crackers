import rawProducts from "@/data/products.js";
import rawCategories from "@/data/crackersCategory.js";

// ============================================================
// Types
// ============================================================

export interface RawProduct {
  name: string;
  slug: string;
  sku: string;
  description: string | null;
  price: number;
  stock_quantity: number;
  low_stock_threshold: number;
  category_id: string;
  is_active: boolean;
  is_featured: boolean;
  weight: number | null;
  unit: string;
}

export interface Product extends RawProduct {
  mrp: number;
  discount_percent: number;
  savings: number;
  rating: number;
  reviews_count: number;
  is_new_arrival: boolean;
  is_trending: boolean;
  is_best_seller: boolean;
  category_name: string;
  category_slug: string;
}

// ============================================================
// Seeded pseudo-random (consistent per SKU)
// ============================================================

function seededRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash) / 2147483647;
}

// ============================================================
// Category index for fast lookup
// ============================================================

const categoryMap = new Map(
  rawCategories.map((c: { id: string; name: string; slug: string }) => [c.id, c])
);

// New arrival category IDs
const NEW_ARRIVAL_IDS = new Set([
  "44c168cd-ba63-44c5-84e1-977ebff28016", // 2025 Atm Special New Arrival
  "cecbe701-49ee-46f7-905a-094cf23df489", // 2025 New Arrival Spinner
  "08f164c0-ee2f-49b9-b1bc-1293c29e6b66", // 2025 New Arrivals
  "5a01a259-de65-49d4-a2f4-0b8da085d903", // 2025 Musical Beats
  "83807f97-c3d5-4f1f-ac71-670d4dbc46ac", // 2025 Atm Crystal Pots
  "1aaf80db-dd9a-426e-803f-9a5d06f65e7f", // 2025 New Arival Sparklers
]);

// Trending category IDs (popular categories)
const TRENDING_IDS = new Set([
  "7855b664-396d-4470-be3f-9d7b637abdef", // Star Pots Series
  "c58c4145-2be0-4207-a93f-3b07f3c3d674", // Royal Colour Fountain
  "efecd5d3-4518-4928-92b3-6c14aecfac51", // Galaxy Colour Celebration
  "e6bec490-e6aa-4c29-ac3e-3c191b549b7a", // King Of Atm Fancy Series
  "7c673bb8-d307-4a68-95cc-995b17617e44", // Sky King Rocket Series
  "d62486d2-7e2c-4753-b48f-dab795034b1e", // Rainbow Colour Sparklers
  "c3ac1be5-bd9a-4577-9cc1-2bff6da4ef1e", // Super Chakkar Festival
  "9f57d146-1a9c-4d74-a9cf-111ee72b4a18", // Royal Colour Flower Pots
]);

// ============================================================
// Enrich a single product
// ============================================================

function enrichProduct(raw: RawProduct): Product {
  const r = seededRandom(raw.sku);
  const r2 = seededRandom(raw.sku + "2");

  const mrp = Math.round(raw.price * (1.25 + r * 0.1) / 5) * 5; // realistic MRP
  const savings = mrp - raw.price;
  const discount_percent = Math.round((savings / mrp) * 100);
  const rating = parseFloat((3.8 + r * 1.2).toFixed(1));
  const reviews_count = Math.floor(12 + r2 * 328);

  const cat = categoryMap.get(raw.category_id) as
    | { name: string; slug: string }
    | undefined;

  return {
    ...raw,
    mrp,
    savings,
    discount_percent,
    rating,
    reviews_count,
    is_new_arrival: NEW_ARRIVAL_IDS.has(raw.category_id) || raw.name.includes("2025"),
    is_trending: TRENDING_IDS.has(raw.category_id),
    is_best_seller: r > 0.75,
    category_name: cat?.name ?? "Crackers",
    category_slug: cat?.slug ?? "crackers",
  };
}

// ============================================================
// Memoized enriched products (compute once)
// ============================================================

let _enriched: Product[] | null = null;

export function getEnrichedProducts(): Product[] {
  if (_enriched) return _enriched;
  _enriched = (rawProducts as RawProduct[])
    .filter((p) => p.is_active)
    .map(enrichProduct);
  return _enriched;
}

// ============================================================
// Selectors
// ============================================================

export function getHotDeals(limit = 8): Product[] {
  // Pick products with highest discount across varied categories
  return getEnrichedProducts()
    .slice()
    .sort((a, b) => b.discount_percent - a.discount_percent)
    .slice(0, limit);
}

export function getTrendingProducts(limit = 12): Product[] {
  return getEnrichedProducts()
    .filter((p) => p.is_trending)
    .slice(0, limit);
}

export function getNewArrivals(limit = 12): Product[] {
  return getEnrichedProducts()
    .filter((p) => p.is_new_arrival)
    .slice(0, limit);
}

export function getBestSellers(limit = 12): Product[] {
  return getEnrichedProducts()
    .filter((p) => p.is_best_seller)
    .slice(0, limit);
}

export function getFeaturedProducts(limit = 8): Product[] {
  return getEnrichedProducts()
    .slice()
    .sort((a, b) => b.reviews_count - a.reviews_count)
    .slice(0, limit);
}

export function getProductBySlug(slug: string): Product | undefined {
  return getEnrichedProducts().find((p) => p.slug === slug);
}

export function getProductsByCategory(categoryId: string): Product[] {
  return getEnrichedProducts().filter((p) => p.category_id === categoryId);
}

export function getProductsByCategorySlug(slug: string): Product[] {
  const cat = rawCategories.find(
    (c: { slug: string }) => c.slug === slug
  ) as { id: string } | undefined;
  if (!cat) return [];
  return getProductsByCategory(cat.id);
}

export function getProductsByBudget(min: number, max: number): Product[] {
  return getEnrichedProducts().filter(
    (p) => p.price >= min && (max === Infinity || p.price <= max)
  );
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return getEnrichedProducts().filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category_name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q)
  );
}

export function getRelatedProducts(product: Product, limit = 6): Product[] {
  return getEnrichedProducts()
    .filter(
      (p) => p.category_id === product.category_id && p.slug !== product.slug
    )
    .slice(0, limit);
}

export function formatPrice(price: number): string {
  return `₹${price.toLocaleString("en-IN")}`;
}
