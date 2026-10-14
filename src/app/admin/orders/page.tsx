import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminOrders } from "@/components/admin/AdminOrders";

export const metadata: Metadata = { title: "Orders" };

export default function OrdersPage() {
  return (
    <Suspense fallback={null}>
      <AdminOrders />
    </Suspense>
  );
}
