import type { Metadata } from "next";
import { Suspense } from "react";
import { AccountView } from "@/components/account/AccountView";

export const metadata: Metadata = { title: "Account (demo)", alternates: { canonical: "/account" } };

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="h-[70vh]" aria-busy="true" />}>
      <AccountView />
    </Suspense>
  );
}
