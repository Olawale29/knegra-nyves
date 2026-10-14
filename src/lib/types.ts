/**
 * Core domain types for the KNEGRA NYVES storefront demo.
 * Kept backend-agnostic so a later API (e.g. Laravel) can return the same shapes.
 */

export type CurrencyCode = "NGN" | "USD" | "GBP";

/** Whether a fact came from the client's own material or is a demo stand-in. */
export type Provenance = "verified" | "demo";

export interface MediaAsset {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** Where the original came from — useful for the asset inventory and admin. */
  origin?: "drive" | "instagram" | "derived";
  /** Optional focal point for object-position, e.g. "50% 30%". */
  focus?: string;
}

export interface VideoAsset {
  src: string;
  poster: MediaAsset;
  width: number;
  height: number;
  label: string;
}

export interface OptionValue {
  id: string;
  label: string;
  /** Hex colour for colour swatches. */
  swatch?: string;
  /** Overrides the product base price when this value is chosen. */
  price?: number;
  /** Indices into product.images to show when this value is selected. */
  imageIndexes?: number[];
  soldOut?: boolean;
  /** Short helper text, e.g. "2 headbands". */
  note?: string;
}

export type OptionKind = "colour" | "size" | "set";

export interface ProductOption {
  id: OptionKind;
  label: string;
  values: OptionValue[];
}

export type Availability = "in_stock" | "low_stock" | "made_to_order" | "sold_out";

export interface ProductDetailSection {
  title: string;
  body: string[];
  provenance: Provenance;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  /** "Inheritance Register" archive number shown on cards and product pages. */
  archiveNo: string;
  /** Short line under the name on cards. */
  subtitle?: string;
  description: string[];
  price: number;
  currency: CurrencyCode;
  priceProvenance: Provenance;
  images: MediaAsset[];
  video?: VideoAsset;
  collection: string; // collection slug
  category: CategorySlug;
  options: ProductOption[];
  availability: Availability;
  /** Demo stock count used by the admin prototype. */
  stock: number;
  details: ProductDetailSection[];
  related: string[]; // product slugs
  tags: string[];
  /** Only set when the client's own material supports it. */
  badge?: { label: string; provenance: Provenance };
  /** ISO date used for "new arrivals" sorting (demo). */
  addedAt: string;
  featured?: boolean;
}

export type CategorySlug =
  | "silk-scarves"
  | "headbands"
  | "co-ords"
  | "tees"
  | "loungewear"
  | "shorts"
  | "caps";

export interface Category {
  slug: CategorySlug;
  name: string;
}

export interface Collection {
  slug: string;
  name: string;
  kicker: string;
  intro: string;
  /** Copy provenance — client's own words vs. editable placeholder. */
  copyProvenance: Provenance;
  hero: MediaAsset;
  tile: MediaAsset;
  season?: string;
}

export interface CartLine {
  /** product id + selected option values; unique per configuration. */
  key: string;
  productId: string;
  quantity: number;
  selections: Partial<Record<OptionKind, string>>;
  /** Optional Inheritance Card inscription. */
  inscription?: string;
}

export interface Address {
  firstName: string;
  lastName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postcode?: string;
  country: string;
  phone: string;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  joined: string;
  orders: number;
  lifetimeValue: number;
  tier: "New" | "Returning" | "Icon";
}

export type OrderStatus = "Pending" | "Processing" | "Dispatched" | "Delivered" | "Cancelled";

export interface OrderLine {
  productId: string;
  name: string;
  variant: string;
  quantity: number;
  unitPrice: number;
  inscription?: string;
}

export interface MockOrder {
  id: string;
  reference: string;
  placedAt: string;
  customerId: string;
  customerName: string;
  email: string;
  status: OrderStatus;
  lines: OrderLine[];
  delivery: { method: string; fee: number };
  address: Address;
  total: number;
  demo: true;
}

export interface DeliveryOption {
  id: string;
  label: string;
  description: string;
  fee: number;
  eta: string;
}

export interface NavGroup {
  title: string;
  links: { label: string; href: string; note?: string }[];
}

export interface EditorialCampaign {
  id: string;
  kicker: string;
  title: string;
  body: string;
  copyProvenance: Provenance;
  href: string;
  cta: string;
  media: MediaAsset;
  video?: VideoAsset;
}
