import type { Metadata } from "next";
import { AdminCustomers } from "@/components/admin/AdminMisc";

export const metadata: Metadata = { title: "Customers" };

export default function CustomersPage() {
  return <AdminCustomers />;
}
