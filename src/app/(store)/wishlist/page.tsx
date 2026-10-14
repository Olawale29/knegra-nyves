import type { Metadata } from "next";
import { WishlistView } from "@/components/account/WishlistView";

export const metadata: Metadata = { title: "Wishlist", alternates: { canonical: "/wishlist" } };

export default function WishlistPage() {
  return <WishlistView />;
}
