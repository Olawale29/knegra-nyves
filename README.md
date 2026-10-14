# KNEGRA NYVES — Flagship Store (frontend demo)

A frontend-only demonstration of the KNEGRA NYVES digital flagship: storefront, product pages, bag, checkout, account, wishlist and a mock admin studio. Built from the house's own photography, films, Instagram copy and the manifesto on her draft site.

> **Demo only.** No backend, no payments, no real orders. Bag, wishlist, account and admin edits live in the visitor's browser (`localStorage`). Illustrative prices and delivery options are labelled on the page.

## Run it locally

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
```

Production preview:

```bash
npm run build
npm start          # http://localhost:3000
```

Deploy to Vercel by importing the folder/repo — no environment variables are required. Set `NEXT_PUBLIC_SITE_URL` to the real domain when known (used for canonical and Open Graph URLs; the demo is `noindex`).

## Routes

| Route | What it is |
|---|---|
| `/` | Homepage — split campaign hero (The Art of Flight + Coquette film), six collections, the Register rail, the Manifesto, Art of Flight editorial, Inheritance Register teaser, Randolph lookbook, Instagram grid |
| `/shop` | All 12 pieces — URL-synced filters (piece, colour, size, price), sort, active-filter chips, mobile filter drawer |
| `/collections/[slug]` | The Art of Flight · The NYVES Coquette · KN Forms · The Monogram Edit · The Randolph · Essentials & Sport |
| `/products/[slug]` | Gallery with thumbnails, film slide, keyboard/touch lightbox with zoom; set/colour/size selection with validation; Inheritance Card inscription; accordions; related and recently viewed |
| `/cart` | Bag page (also a slide-out drawer everywhere) |
| `/checkout` | Details → Delivery → Review → demo confirmation with a `DEMO-XXXXXX` reference |
| `/account` | Demo sign-in/registration, overview, order history (placed + sample), order detail, profile |
| `/wishlist` | Saved pieces |
| `/the-house` | Manifesto, pillars, house facts, the Inheritance Register |
| `/client-care`, `/policies/*` | Contact, FAQ, placeholder policies |
| `/admin` | Commerce studio (not linked from the storefront): overview + revenue chart, orders, products (edit/add), inventory, collections, customers, campaigns |

## Where to change things

| To change | Edit |
|---|---|
| Announcement bar, contact, currency, delivery options | `src/data/site.ts` |
| Hero, manifesto, pillars, campaigns, FAQ, policies | `src/data/content.ts` |
| Products, prices, options, stock | `src/data/products.ts` |
| Collections, navigation | `src/data/collections.ts` |
| Any photograph or film | `src/data/media.ts` + `public/media/` (see `ASSET_INVENTORY.md`) |
| Colours, type, spacing, motion | `src/app/globals.css` (design tokens at the top) |
| Demo customers & orders | `src/data/mock-orders.ts` |

Every product carries `priceProvenance: "verified" | "demo"`. Only verified prices appear without the "Illustrative" tag and only they are emitted in structured data.

## Stack

Next.js 16 (App Router, static generation, Turbopack) · React 19 · TypeScript (strict) · Tailwind CSS v4 · Motion · Lucide · Zustand (persisted to localStorage). Fonts (Cormorant Garamond + Geist) are self-hosted from `src/fonts`.

## Quality checks run

- `npm run build`, `tsc --noEmit` and `eslint` — clean.
- 46 scripted browser interactions (variants, validation, bag persistence, filters, sort, search, checkout, account, wishlist, admin edits, 404) — all passing.
- No horizontal overflow on 17 routes at 360, 390, 430, 768, 1024, 1440 and 1920 px.
- axe-core (WCAG 2 A/AA + best practice) — zero violations on 16 routes.
- Reduced motion: films don't render, reveals and hero animation are disabled.

## Built for a later backend

Types in `src/lib/types.ts` are API-shaped (Product, Collection, CartLine, MockOrder, Customer…). Swapping `src/data/*` for API calls and the `src/store` persistence for server state is the main integration step.
