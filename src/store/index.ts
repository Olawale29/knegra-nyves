"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { lineKey, type Selections } from "@/lib/catalog";
import type { Address, CartLine, MockOrder, OrderStatus, Product } from "@/lib/types";

/**
 * Browser-only demo state. Every store persists to localStorage with
 * `skipHydration`, so the server and first client render agree (empty), and
 * <StoreHydrator/> rehydrates after mount. Nothing here leaves the browser.
 */

const storage = createJSONStorage(() => localStorage);
const MAX_QTY = 10;

// ───────────────────────── Bag ─────────────────────────
interface BagState {
  lines: CartLine[];
  drawerOpen: boolean;
  lastAdded: string | null;
  add: (productId: string, selections: Selections, quantity?: number, inscription?: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

export const useBag = create<BagState>()(
  persist(
    (set) => ({
      lines: [],
      drawerOpen: false,
      lastAdded: null,
      add: (productId, selections, quantity = 1, inscription) =>
        set((s) => {
          const clean = inscription?.trim() || undefined;
          const key = lineKey(productId, selections, clean);
          const existing = s.lines.find((l) => l.key === key);
          const lines = existing
            ? s.lines.map((l) => (l.key === key ? { ...l, quantity: Math.min(MAX_QTY, l.quantity + quantity) } : l))
            : [...s.lines, { key, productId, selections, quantity: Math.min(MAX_QTY, quantity), inscription: clean }];
          return { lines, drawerOpen: true, lastAdded: key };
        }),
      setQuantity: (key, quantity) =>
        set((s) => ({
          lines:
            quantity <= 0
              ? s.lines.filter((l) => l.key !== key)
              : s.lines.map((l) => (l.key === key ? { ...l, quantity: Math.min(MAX_QTY, quantity) } : l)),
        })),
      remove: (key) => set((s) => ({ lines: s.lines.filter((l) => l.key !== key) })),
      clear: () => set({ lines: [], lastAdded: null }),
      openDrawer: () => set({ drawerOpen: true }),
      closeDrawer: () => set({ drawerOpen: false, lastAdded: null }),
    }),
    { name: "kn-bag", storage, skipHydration: true, partialize: (s) => ({ lines: s.lines }) },
  ),
);

export const bagCount = (lines: CartLine[]) => lines.reduce((n, l) => n + l.quantity, 0);
export { MAX_QTY };

// ───────────────────────── Wishlist ─────────────────────────
interface WishState {
  ids: string[];
  toggle: (productId: string) => void;
  remove: (productId: string) => void;
}

export const useWishlist = create<WishState>()(
  persist(
    (set) => ({
      ids: [],
      toggle: (id) => set((s) => ({ ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [id, ...s.ids] })),
      remove: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
    }),
    { name: "kn-wishlist", storage, skipHydration: true },
  ),
);

// ───────────────────────── Recently viewed ─────────────────────────
interface RecentState {
  ids: string[];
  push: (id: string) => void;
}

export const useRecent = create<RecentState>()(
  persist(
    (set) => ({
      ids: [],
      push: (id) => set((s) => ({ ids: [id, ...s.ids.filter((x) => x !== id)].slice(0, 8) })),
    }),
    { name: "kn-recent", storage, skipHydration: true },
  ),
);

// ───────────────────────── Demo session ─────────────────────────
export interface DemoProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface SessionState {
  signedIn: boolean;
  profile: DemoProfile | null;
  /** Demo orders placed through the checkout in this browser. */
  placedOrders: MockOrder[];
  signIn: (profile: DemoProfile) => void;
  signOut: () => void;
  updateProfile: (profile: DemoProfile) => void;
  addOrder: (order: MockOrder) => void;
}

export const useSession = create<SessionState>()(
  persist(
    (set) => ({
      signedIn: false,
      profile: null,
      placedOrders: [],
      signIn: (profile) => set({ signedIn: true, profile }),
      signOut: () => set({ signedIn: false, profile: null }),
      updateProfile: (profile) => set({ profile }),
      addOrder: (order) => set((s) => ({ placedOrders: [order, ...s.placedOrders].slice(0, 20) })),
    }),
    { name: "kn-session", storage, skipHydration: true },
  ),
);

// ───────────────────────── Checkout draft ─────────────────────────
export interface CheckoutDraft {
  email: string;
  phone: string;
  address: Address;
  deliveryId: string;
  notes: string;
}

// ───────────────────────── Admin demo overrides ─────────────────────────
export type ProductPatch = Partial<Pick<Product, "name" | "price" | "stock" | "availability" | "collection" | "category">> & {
  hidden?: boolean;
  description?: string;
};

export interface DemoCampaign {
  id: string;
  title: string;
  placement: "Homepage hero" | "Announcement bar" | "Editorial band" | "Collection banner";
  status: "Live" | "Scheduled" | "Draft";
  starts: string;
}

interface AdminState {
  productPatches: Record<string, ProductPatch>;
  createdProducts: Product[];
  orderStatus: Record<string, OrderStatus>;
  campaigns: DemoCampaign[];
  patchProduct: (id: string, patch: ProductPatch) => void;
  createProduct: (p: Product) => void;
  setOrderStatus: (id: string, status: OrderStatus) => void;
  upsertCampaign: (c: DemoCampaign) => void;
  removeCampaign: (id: string) => void;
  reset: () => void;
}

const defaultCampaigns: DemoCampaign[] = [
  { id: "cmp-1", title: "The Inheritance Begins Here", placement: "Homepage hero", status: "Live", starts: "2026-10-01" },
  { id: "cmp-2", title: "The Art of Flight — silk scarves", placement: "Editorial band", status: "Live", starts: "2026-10-09" },
  { id: "cmp-3", title: "KN Forms, SS26", placement: "Announcement bar", status: "Live", starts: "2026-09-15" },
  { id: "cmp-4", title: "One year of Icons — anniversary", placement: "Collection banner", status: "Scheduled", starts: "2026-12-28" },
];

export const useAdmin = create<AdminState>()(
  persist(
    (set) => ({
      productPatches: {},
      createdProducts: [],
      orderStatus: {},
      campaigns: defaultCampaigns,
      patchProduct: (id, patch) => set((s) => ({ productPatches: { ...s.productPatches, [id]: { ...s.productPatches[id], ...patch } } })),
      createProduct: (p) => set((s) => ({ createdProducts: [p, ...s.createdProducts] })),
      setOrderStatus: (id, status) => set((s) => ({ orderStatus: { ...s.orderStatus, [id]: status } })),
      upsertCampaign: (c) =>
        set((s) => ({
          campaigns: s.campaigns.some((x) => x.id === c.id) ? s.campaigns.map((x) => (x.id === c.id ? c : x)) : [c, ...s.campaigns],
        })),
      removeCampaign: (id) => set((s) => ({ campaigns: s.campaigns.filter((c) => c.id !== id) })),
      reset: () => set({ productPatches: {}, createdProducts: [], orderStatus: {}, campaigns: defaultCampaigns }),
    }),
    { name: "kn-admin", storage, skipHydration: true },
  ),
);

// ───────────────────────── Transient UI ─────────────────────────
interface UiState {
  searchOpen: boolean;
  menuOpen: boolean;
  setSearch: (open: boolean) => void;
  setMenu: (open: boolean) => void;
}

export const useUi = create<UiState>()((set) => ({
  searchOpen: false,
  menuOpen: false,
  setSearch: (searchOpen) => set({ searchOpen, menuOpen: false }),
  setMenu: (menuOpen) => set({ menuOpen }),
}));

export function rehydrateStores() {
  useBag.persist.rehydrate();
  useWishlist.persist.rehydrate();
  useRecent.persist.rehydrate();
  useSession.persist.rehydrate();
  useAdmin.persist.rehydrate();
}
