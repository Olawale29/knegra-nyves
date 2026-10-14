import type { Metadata } from "next";
import { AdminCampaigns } from "@/components/admin/AdminMisc";

export const metadata: Metadata = { title: "Campaigns" };

export default function ContentPage() {
  return <AdminCampaigns />;
}
