import { media, videos } from "@/data/media";
import type { EditorialCampaign, Provenance } from "@/lib/types";

/**
 * Editorial copy. Lines marked "verified" are the client's own words, taken
 * from her Instagram captions or her draft site (knegra-nyves-archive.base44.app).
 * Lines marked "demo" are placeholders written for this demo.
 */

export const hero = {
  kicker: "Lagos · Est. 2024",
  title: ["The Inheritance", "Begins Here."],
  body: "A house for those building their legacy — and the pieces worth passing on.",
  primary: { label: "Enter the House", href: "/shop" },
  secondary: { label: "The Art of Flight", href: "/collections/the-art-of-flight" },
  aside: {
    kicker: "The NYVES Coquette",
    title: "Crafted for the bold, calm and confident.",
    href: "/products/nyves-coquette-headband",
    cta: "Shop the headband",
  },
  provenance: "verified" as Provenance,
};

/** The manifesto, from the client's draft site. */
export const manifesto = {
  kicker: "The Manifesto",
  inherit: [
    "Some inherit wealth.",
    "Some inherit influence.",
    "Some inherit opportunity.",
    "Some inherit nothing at all.",
  ],
  question: "What will you leave behind?",
  body: "KNEGRA NYVES was created for those answering that question through what they build, create, and become — the builders, the dreamers, the creators, the heirs.",
  close: ["True luxury has never been about ownership.", "It has been about permanence."],
  provenance: "verified" as Provenance,
};

export const pillars = [
  {
    n: "01",
    title: "Inheritance",
    body: "Legacy is not reserved for the fortunate. Through vision, discipline and intention, it can be built. Each piece is designed to be passed down — not as clothing, but as a chapter of your story.",
  },
  {
    n: "02",
    title: "Craft",
    body: "We honour the discipline of creation. From the garments we produce to the stories we tell, we reject the disposable and pursue work worthy of endurance.",
  },
  {
    n: "03",
    title: "Icons",
    body: "An icon is not defined by wealth, status or fame. An icon is someone building something that matters — creating impact that will outlive them.",
  },
] as const;

export const campaigns: EditorialCampaign[] = [
  {
    id: "art-of-flight",
    kicker: "Campaign — The Art of Flight",
    title: "A flowing legacy, redefined.",
    body: "Silk, released into the wind. Galloping horses circle the KN medallion on an ivory ground; the monogram runs camel and noir.",
    copyProvenance: "verified",
    href: "/collections/the-art-of-flight",
    cta: "Discover the scarves",
    media: media.flightStudio,
    video: videos.flightScarf,
  },
  {
    id: "randolph",
    kicker: "Lookbook — The Randolph",
    title: "The future of style.",
    body: "The Randolph pajamas duo — the KNEGRA NYVES original, unisex. Designed for comfort; a piece that exudes confidence, attitude and style.",
    copyProvenance: "verified",
    href: "/collections/the-randolph",
    cta: "View the lookbook",
    media: media.randolphShoreHat,
  },
];

/** Brand facts drawn from the client's material — shown on The House page. */
export const houseFacts: { label: string; value: string; provenance: Provenance }[] = [
  { label: "Founded", value: "December 2024 — first anniversary 28.12.25", provenance: "verified" },
  { label: "Home", value: "Lagos, Nigeria", provenance: "verified" },
  { label: "The community", value: "Icons", provenance: "verified" },
  { label: "In their words", value: "A luxury fashion house rooted in cultural depth", provenance: "verified" },
];

export const faqs: { q: string; a: string }[] = [
  {
    q: "Is this a working shop?",
    a: "Not yet. This is a frontend demonstration of the KNEGRA NYVES flagship store. Bag, wishlist and account data are stored only in your browser, and no order is ever sent or charged.",
  },
  {
    q: "How do I choose a headband set?",
    a: "The NYVES Coquette headband is offered singly or in sets of two, three or four. Choose your set and colour on the product page — the set price is applied automatically.",
  },
  {
    q: "Can I add a personal inscription?",
    a: "Yes. Every piece can carry an Inheritance Card — a short note written for the person it is meant for, packed with the order. Add it on the product page.",
  },
  {
    q: "Where do you deliver?",
    a: "Placeholder: delivery coverage, timings and fees are still to be confirmed by the house. The options shown at checkout are illustrative.",
  },
  {
    q: "What is your returns policy?",
    a: "Placeholder: the house will publish its returns policy here. Until then, please contact us before sending anything back.",
  },
  {
    q: "How should I care for silk?",
    a: "Placeholder: care guidance for each piece will be supplied by the house.",
  },
];

/** Placeholder policy pages — to be replaced with the client's official text. */
export const policies: Record<
  "delivery-returns" | "privacy" | "terms",
  { title: string; intro: string; sections: { h: string; p: string }[] }
> = {
  "delivery-returns": {
    title: "Delivery & Returns",
    intro: "Placeholder copy. The house has not yet published its delivery and returns terms; this page shows the structure they will take.",
    sections: [
      { h: "Delivery coverage", p: "Where the house delivers, and which courier partners it uses, will be listed here." },
      { h: "Timings & fees", p: "Confirmed timings and fees will replace the illustrative options shown at checkout." },
      { h: "Returns", p: "Eligibility, the return window and how to start a return will be described here." },
      { h: "Exchanges", p: "How size or colour exchanges are handled will be described here." },
    ],
  },
  privacy: {
    title: "Privacy",
    intro: "Placeholder copy. A full privacy notice will be supplied before launch.",
    sections: [
      { h: "This demo", p: "This demonstration stores your bag, wishlist and demo account only in your own browser (localStorage). Nothing is sent to a server." },
      { h: "At launch", p: "The house's privacy notice — covering what is collected, why and for how long — will be published here." },
    ],
  },
  terms: {
    title: "Terms",
    intro: "Placeholder copy. Terms of sale will be supplied before launch.",
    sections: [
      { h: "Demonstration only", p: "Prices marked as illustrative, delivery options and stock levels on this demo are not offers of sale." },
      { h: "At launch", p: "The house's terms of sale will be published here." },
    ],
  },
};
