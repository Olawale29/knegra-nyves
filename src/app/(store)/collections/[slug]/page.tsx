import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { collectionBySlug, collections } from "@/data/collections";
import { productsInCollection } from "@/lib/catalog";
import { CollectionHeader } from "@/components/shop/CollectionHeader";
import { CollectionView } from "@/components/shop/CollectionView";

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const c = collectionBySlug.get(slug);
  if (!c) return {};
  return {
    title: c.name,
    description: c.intro,
    alternates: { canonical: `/collections/${c.slug}` },
    openGraph: { title: `${c.name} · KNEGRA NYVES`, description: c.intro, images: [{ url: c.hero.src, width: c.hero.width, height: c.hero.height, alt: c.hero.alt }] },
  };
}

export default async function CollectionPage(props: PageProps<"/collections/[slug]">) {
  const { slug } = await props.params;
  const collection = collectionBySlug.get(slug);
  if (!collection) notFound();
  const items = productsInCollection(slug);

  return (
    <>
      <CollectionHeader
        kicker={collection.kicker}
        title={collection.name}
        intro={collection.intro}
        image={collection.hero}
        provenance={collection.copyProvenance}
        crumbs={[{ label: "Home", href: "/" }, { label: "Collections", href: "/shop" }, { label: collection.name }]}
      />
      <Suspense fallback={<div className="gutter max-site h-[60vh]" aria-busy="true" />}>
        <CollectionView products={items} />
      </Suspense>
    </>
  );
}
