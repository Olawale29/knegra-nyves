import type { Metadata } from "next";
import { AdminInventory } from "@/components/admin/AdminInventory";

export const metadata: Metadata = { title: "Inventory" };

export default function InventoryPage() {
  return <AdminInventory />;
}
