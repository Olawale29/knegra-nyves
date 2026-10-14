import { media } from "@/data/media";
import type { Category, Collection, NavGroup } from "@/lib/types";

export const collections: Collection[] = [
  {
    slug: "the-art-of-flight",
    name: "The Art of Flight",
    kicker: "Silk scarves",
    intro: "A flowing legacy, redefined. Horses in full gallop, the house monogram in camel and noir — silk made to move.",
    copyProvenance: "verified",
    hero: media.flightStudio,
    tile: media.noirDraped,
  },
  {
    slug: "coquette",
    name: "The NYVES Coquette",
    kicker: "Headbands",
    intro: "This is not just a headband — it is quiet power redefined. Crafted for the bold, calm and confident, for her and for him.",
    copyProvenance: "verified",
    hero: media.headbandFlatlay,
    tile: media.headbandCobaltWorn,
  },
  {
    slug: "kn-forms",
    name: "KN Forms",
    kicker: "SS26 · The Inheritance Drop",
    intro: "A study in shape, structure and identity. Three forms — the circle, the line, the square — each carried on a single tee.",
    copyProvenance: "verified",
    hero: media.formsCover,
    tile: media.formsQuadrum,
    season: "SS26",
  },
  {
    slug: "monogram",
    name: "The Monogram Edit",
    kicker: "Co-ords",
    intro: "The scarf's monogram, cut into camp shirts, trousers and shorts. Made to be worn together.",
    copyProvenance: "demo",
    hero: media.coordTrouserFront,
    tile: media.coordShortB,
  },
  {
    slug: "the-randolph",
    name: "The Randolph",
    kicker: "Pajamas duo · Unisex",
    intro: "The future of style. The KNEGRA NYVES original — designed for comfort, worn with attitude.",
    copyProvenance: "verified",
    hero: media.randolphDuneWide,
    tile: media.randolphShoreHat,
  },
  {
    slug: "essentials",
    name: "Essentials & Sport",
    kicker: "Every day",
    intro: "Style in motion. The embossed tee, the sport short and the iconic KN cap.",
    copyProvenance: "verified",
    hero: media.storeWall,
    tile: media.capsSand,
  },
];

export const collectionBySlug = new Map(collections.map((c) => [c.slug, c]));

export const categories: Category[] = [
  { slug: "silk-scarves", name: "Silk Scarves" },
  { slug: "headbands", name: "Headbands" },
  { slug: "co-ords", name: "Co-ords" },
  { slug: "tees", name: "Tees" },
  { slug: "loungewear", name: "Loungewear" },
  { slug: "shorts", name: "Shorts" },
  { slug: "caps", name: "Caps" },
];

export const categoryName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? slug;

export const megaMenu: { collections: NavGroup; shop: NavGroup; house: NavGroup } = {
  collections: {
    title: "Collections",
    links: collections.map((c) => ({ label: c.name, href: `/collections/${c.slug}`, note: c.kicker })),
  },
  shop: {
    title: "Shop by piece",
    links: [
      { label: "All pieces", href: "/shop" },
      ...categories.map((c) => ({ label: c.name, href: `/shop?category=${c.slug}` })),
    ],
  },
  house: {
    title: "The House",
    links: [
      { label: "Our story", href: "/the-house" },
      { label: "The Inheritance Register", href: "/the-house#register" },
      { label: "Request access", href: "/the-house#access" },
      { label: "Client care", href: "/client-care" },
    ],
  },
};
