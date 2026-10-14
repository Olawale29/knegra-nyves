"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { create } from "zustand";
import { rehydrateStores, useBag, useUi } from "@/store";

const useHydratedStore = create<{ hydrated: boolean }>(() => ({ hydrated: false }));

/** True once persisted browser state has been loaded (always false on the server). */
export const useHydrated = () => useHydratedStore((s) => s.hydrated);

export function StoreHydrator() {
  const pathname = usePathname();

  useEffect(() => {
    rehydrateStores();
    useHydratedStore.setState({ hydrated: true });
  }, []);

  // Close transient overlays whenever the route changes.
  useEffect(() => {
    useUi.setState({ searchOpen: false, menuOpen: false });
    useBag.getState().closeDrawer();
  }, [pathname]);

  return null;
}
