"use client";

import { useMemo } from "react";
import { mockOrders } from "@/data/mock-orders";
import { products as baseProducts } from "@/data/products";
import type { MockOrder, Product } from "@/lib/types";
import { useAdmin, useSession, type ProductPatch } from "@/store";
import { useHydrated } from "@/components/providers/StoreHydrator";

export type AdminProduct = Product & { hidden?: boolean; draft?: boolean };

/** Merges seed data with edits made in the demo admin (stored in this browser). */
export function useAdminProducts(): AdminProduct[] {
  const hydrated = useHydrated();
  const patches = useAdmin((s) => s.productPatches);
  const created = useAdmin((s) => s.createdProducts);
  return useMemo(() => {
    const apply = (p: Product, patch?: ProductPatch): AdminProduct =>
      patch ? { ...p, ...patch, description: patch.description ? [patch.description] : p.description } : p;
    const base = baseProducts.map((p) => apply(p, hydrated ? patches[p.id] : undefined));
    const extra = hydrated ? created.map((p) => ({ ...apply(p, patches[p.id]), draft: true })) : [];
    return [...extra, ...base];
  }, [hydrated, patches, created]);
}

/** Seed orders plus demo orders placed through this browser's checkout. */
export function useAdminOrders(): MockOrder[] {
  const hydrated = useHydrated();
  const statusOverrides = useAdmin((s) => s.orderStatus);
  const placed = useSession((s) => s.placedOrders);
  return useMemo(() => {
    const all = [...(hydrated ? placed : []), ...mockOrders];
    return all.map((o) => (hydrated && statusOverrides[o.id] ? { ...o, status: statusOverrides[o.id] } : o));
  }, [hydrated, placed, statusOverrides]);
}
