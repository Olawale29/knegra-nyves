import type { Metadata } from "next";
import { Suspense } from "react";
import { media } from "@/data/media";
import { products } from "@/data/products";
import { CollectionHeader } from "@/components/shop/CollectionHeader";
import { CollectionView } from "@/components/shop/CollectionView";

export const metadata: Metadata = {
  title: "All pieces",
  description: "Every piece in the KNEGRA NYVES register — silk scarves, the NYVES Coquette headband, KN Forms, the Randolph and more.",
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  return (
    <>
      <CollectionHeader
        kicker={`The Register · ${products.length} pieces`}
        title="All pieces"
        intro="Every piece entered in the house register, from Nº 001 onwards. Filter by piece, colour or price."
        image={media.storeWall}
        crumbs={[{ label: "Home", href: "/" }, { label: "All pieces" }]}
      />
      <Suspense fallback={<div className="gutter max-site h-[60vh]" aria-busy="true" />}>
        <CollectionView products={products} editorial={{ media: media.recognizedDuo, caption: "Icons, recognised." }} />
      </Suspense>
    </>
  );
}
