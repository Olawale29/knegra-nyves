import { collections } from "@/data/collections";
import { productById, products } from "@/data/products";
import type { CartLine, Collection, OptionKind, Product } from "@/lib/types";

export type SortKey = "featured" | "newest" | "price-asc" | "price-desc" | "name";

export const sortOptions: { id: SortKey; label: string }[] = [
  { id: "featured", label: "Curated" },
  { id: "newest", label: "Newest" },
  { id: "price-asc", label: "Price, low to high" },
  { id: "price-desc", label: "Price, high to low" },
  { id: "name", label: "Name, A–Z" },
];

export type Selections = Partial<Record<OptionKind, string>>;

/** The price for a given configuration (set options override the base price). */
export function priceFor(product: Product, selections: Selections = {}): number {
  for (const option of product.options) {
    const chosen = option.values.find((v) => v.id === selections[option.id]);
    if (chosen?.price !== undefined) return chosen.price;
  }
  return product.price;
}

/** Lowest price a product can be bought for — used for "from" pricing on cards. */
export function fromPrice(product: Product): { amount: number; isFrom: boolean } {
  const setPrices = product.options.flatMap((o) => o.values.map((v) => v.price).filter((p): p is number => p !== undefined));
  if (setPrices.length > 1) return { amount: Math.min(...setPrices), isFrom: true };
  return { amount: product.price, isFrom: false };
}

/** Options the shopper must choose before adding to bag (more than one value). */
export function requiredOptions(product: Product) {
  return product.options.filter((o) => o.values.length > 1);
}

/** Default selections: single-value options are pre-selected. */
export function defaultSelections(product: Product): Selections {
  const s: Selections = {};
  for (const o of product.options) {
    const available = o.values.filter((v) => !v.soldOut);
    if (o.values.length === 1 && available[0]) s[o.id] = available[0].id;
  }
  return s;
}

/** True when a product can be quick-added without choosing anything. */
export function canQuickAdd(product: Product): boolean {
  return product.availability !== "sold_out" && requiredOptions(product).length === 0;
}

export function variantLabel(product: Product, selections: Selections): string {
  return product.options
    .map((o) => o.values.find((v) => v.id === selections[o.id])?.label)
    .filter(Boolean)
    .join(" · ");
}

export function lineKey(productId: string, selections: Selections, inscription?: string): string {
  const parts = Object.keys(selections)
    .sort()
    .map((k) => `${k}:${selections[k as OptionKind]}`);
  return [productId, ...parts, inscription ? `i:${inscription.trim().toLowerCase()}` : ""].filter(Boolean).join("|");
}

export function resolveLines(lines: CartLine[]) {
  return lines
    .map((line) => {
      const product = productById.get(line.productId);
      if (!product) return null;
      const unit = priceFor(product, line.selections);
      const image = imagesFor(product, line.selections)[0] ?? product.images[0];
      return { line, product, unit, image, total: unit * line.quantity, variant: variantLabel(product, line.selections) };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);
}

export function imagesFor(product: Product, selections: Selections) {
  const colour = product.options.find((o) => o.id === "colour")?.values.find((v) => v.id === selections.colour);
  if (colour?.imageIndexes?.length) {
    return colour.imageIndexes.map((i) => product.images[i]).filter(Boolean);
  }
  return product.images;
}

export function productsInCollection(slug: string): Product[] {
  return products.filter((p) => p.collection === slug);
}

export function relatedProducts(product: Product, limit = 4): Product[] {
  const explicit = product.related.map((slug) => products.find((p) => p.slug === slug)).filter((p): p is Product => !!p);
  const extra = products.filter((p) => p.id !== product.id && !explicit.includes(p) && p.collection === product.collection);
  return [...explicit, ...extra].slice(0, limit);
}

export function sortProducts(list: Product[], sort: SortKey): Product[] {
  const copy = [...list];
  switch (sort) {
    case "newest":
      return copy.sort((a, b) => b.addedAt.localeCompare(a.addedAt));
    case "price-asc":
      return copy.sort((a, b) => fromPrice(a).amount - fromPrice(b).amount);
    case "price-desc":
      return copy.sort((a, b) => fromPrice(b).amount - fromPrice(a).amount);
    case "name":
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return copy.sort((a, b) => Number(!!b.featured) - Number(!!a.featured) || a.archiveNo.localeCompare(b.archiveNo));
  }
}

export interface Filters {
  categories: string[];
  colours: string[];
  sizes: string[];
  price: string | null; // bucket id
}

export const priceBuckets = [
  { id: "under-30", label: "Under ₦30,000", min: 0, max: 29999 },
  { id: "30-80", label: "₦30,000 – ₦80,000", min: 30000, max: 80000 },
  { id: "over-80", label: "Over ₦80,000", min: 80001, max: Infinity },
];

export function filterProducts(list: Product[], f: Filters): Product[] {
  return list.filter((p) => {
    if (f.categories.length && !f.categories.includes(p.category)) return false;
    if (f.colours.length) {
      const colours = p.options.find((o) => o.id === "colour")?.values.map((v) => v.label) ?? [];
      if (!colours.some((c) => f.colours.includes(c))) return false;
    }
    if (f.sizes.length) {
      const sizes = p.options.find((o) => o.id === "size")?.values.map((v) => v.label) ?? [];
      if (!sizes.some((s) => f.sizes.includes(s))) return false;
    }
    if (f.price) {
      const bucket = priceBuckets.find((b) => b.id === f.price);
      const { amount } = fromPrice(p);
      if (bucket && (amount < bucket.min || amount > bucket.max)) return false;
    }
    return true;
  });
}

/** Facet values present in a list — filters only show what the data supports. */
export function facetsFor(list: Product[]) {
  const colours = new Map<string, string | undefined>();
  const sizes = new Set<string>();
  const cats = new Set<string>();
  for (const p of list) {
    cats.add(p.category);
    p.options.find((o) => o.id === "colour")?.values.forEach((v) => colours.set(v.label, v.swatch));
    p.options.find((o) => o.id === "size")?.values.forEach((v) => sizes.add(v.label));
  }
  const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL"];
  return {
    categories: [...cats],
    colours: [...colours.entries()].map(([label, swatch]) => ({ label, swatch })),
    sizes: [...sizes].sort((a, b) => sizeOrder.indexOf(a) - sizeOrder.indexOf(b)),
  };
}

export interface SearchResult {
  products: Product[];
  collections: Collection[];
}

export function search(query: string): SearchResult {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return { products: [], collections: [] };
  const terms = q.split(/\s+/);
  const score = (hay: string) => terms.reduce((s, t) => s + (hay.includes(t) ? 1 : 0), 0);
  const scored = products
    .map((p) => {
      const hay = [p.name, p.subtitle, p.category, p.collection, p.archiveNo, ...p.tags, ...p.options.flatMap((o) => o.values.map((v) => v.label))]
        .join(" ")
        .toLowerCase();
      return { p, s: score(hay) };
    })
    .filter((x) => x.s === terms.length)
    .map((x) => x.p);
  const cols = collections.filter((c) => {
    const members = products.filter((p) => p.collection === c.slug);
    const hay = `${c.name} ${c.kicker} ${c.intro} ${members.map((p) => `${p.name} ${p.category}`).join(" ")}`.toLowerCase();
    return score(hay) === terms.length;
  });
  return { products: scored, collections: cols };
}
