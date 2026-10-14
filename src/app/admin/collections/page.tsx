import type { Metadata } from "next";
import { AdminCollections } from "@/components/admin/AdminMisc";

export const metadata: Metadata = { title: "Collections" };

export default function CollectionsAdminPage() {
  return <AdminCollections />;
}
