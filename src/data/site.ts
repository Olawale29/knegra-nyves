import type { CurrencyCode, DeliveryOption, Provenance } from "@/lib/types";

/**
 * Site-wide configuration. Everything a non-developer may want to change
 * (announcement copy, contact details, currency, policies) lives here.
 *
 * `provenance` marks where copy came from:
 *  - "verified": the client's own words (Instagram posts, her draft site
 *    knegra-nyves-archive.base44.app) or facts shown in her material.
 *  - "demo": editable placeholder written for this demo — confirm before launch.
 */
export const site = {
  name: "KNEGRA NYVES",
  shortName: "Knegra Nyves",
  /** Replace with the production domain once known. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://knegranyves.example",
  description:
    "KNEGRA NYVES — a Lagos fashion house built on inheritance. Silk scarves, the NYVES Coquette headband, KN Forms and the pieces of a legacy in the making.",
  locale: "en_NG",
  currency: "NGN" as CurrencyCode,
  city: "Lagos, Nigeria",
  instagram: { handle: "@knegranyves", url: "https://www.instagram.com/knegranyves/" },
  /** From the client's draft site footer — confirm the mailbox is live. */
  email: "house@knegranyves.com",
  emailProvenance: "verified" as Provenance,
  /** Not supplied by the client yet. */
  phone: null as string | null,
  founded: { label: "Est. 2024", provenance: "verified" as Provenance },
} as const;

export const announcements: { text: string; href?: string }[] = [
  { text: "Discover the world of KNEGRA NYVES", href: "/the-house" },
  { text: "The Art of Flight — silk scarves", href: "/collections/the-art-of-flight" },
  { text: "KN Forms, SS26 — from the Inheritance Drop", href: "/collections/kn-forms" },
];

/**
 * Delivery options are illustrative demo data only. The client has not
 * supplied rates or timings; nothing here is a confirmed promise.
 */
export const deliveryOptions: DeliveryOption[] = [
  {
    id: "lagos-courier",
    label: "Lagos courier",
    description: "Within Lagos State",
    fee: 4500,
    eta: "Illustrative: 1–3 working days",
  },
  {
    id: "nationwide",
    label: "Nationwide delivery",
    description: "Other Nigerian states",
    fee: 9000,
    eta: "Illustrative: 3–7 working days",
  },
  {
    id: "studio-collection",
    label: "Collect from the studio",
    description: "By appointment in Lagos",
    fee: 0,
    eta: "Illustrative: arranged by the house",
  },
];

export const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT — Abuja", "Gombe",
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
  "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto",
  "Taraba", "Yobe", "Zamfara",
];
