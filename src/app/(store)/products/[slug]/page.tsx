import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categoryName, collectionBySlug } from "@/data/collections";
import { productBySlug, products } from "@/data/products";
import { site } from "@/data/site";
import { relatedProducts } from "@/lib/catalog";
import { Accordion, Breadcrumbs, DemoTag } from "@/components/ui/primitives";
import { ProductExperience } from "@/components/product/ProductPurchase";
import { ProductCard } from "@/components/product/ProductCard";
import { RecentlyViewed } from "@/components/product/RecentlyViewed";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const p = productBySlug.get(slug);
  if (!p) return {};
  const image = p.images[0];
  return {
    title: p.name,
    description: p.description[0],
    alternates: { canonical: `/products/${p.slug}` },
    openGraph: {
      title: `${p.name} · ${site.name}`,
      description: p.description[0],
      images: [{ url: image.src, width: image.width, height: image.height, alt: image.alt }],
    },
  };
}

export default async function ProductPage(props: PageProps<"/products/[slug]">) {
  const { slug } = await props.params;
  const product = productBySlug.get(slug);
  if (!product) notFound();
  const collection = collectionBySlug.get(product.collection);
  const related = relatedProducts(product, 4);

  // Structured data: only verifiable facts. Offers are included solely when the
  // price is the client's confirmed price — never for illustrative demo prices.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.archiveNo,
    description: product.description.join(" "),
    image: product.images.map((i) => new URL(i.src, site.url).toString()),
    brand: { "@type": "Brand", name: site.name },
    ...(product.priceProvenance === "verified"
      ? { offers: { "@type": "Offer", priceCurrency: product.currency, price: product.price, url: new URL(`/products/${product.slug}`, site.url).toString() } }
      : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="gutter max-site pb-20 pt-6 lg:pt-8">
        <Breadcrumbs
          className="mb-6 lg:mb-8"
          items={[
            { label: "Home", href: "/" },
            ...(collection ? [{ label: collection.name, href: `/collections/${collection.slug}` }] : [{ label: categoryName(product.category), href: `/shop?category=${product.category}` }]),
            { label: product.name },
          ]}
        />

        <ProductExperience product={product}>
          <div className="mt-10">
            <div className="space-y-4 text-[15px] leading-relaxed text-ink-soft">
              {product.description.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>
            <Accordion
              className="mt-8"
              items={[
                ...product.details.map((d, i) => ({
                  title: d.title,
                  defaultOpen: i === 0,
                  content: (
                    <div>
                      <ul className="space-y-1.5">
                        {d.body.map((b) => (
                          <li key={b}>{b}</li>
                        ))}
                      </ul>
                      {d.provenance === "demo" && <DemoTag className="mt-3">Awaiting information from the house</DemoTag>}
                    </div>
                  ),
                })),
                {
                  title: "Delivery & returns",
                  content: (
                    <div className="space-y-3">
                      <p>Delivery areas, timings, fees and the returns policy will be confirmed and published by the house. The options shown at checkout in this demo are illustrative.</p>
                      <DemoTag>Placeholder copy</DemoTag>
                      <p>
                        <Link href="/policies/delivery-returns" className="link-line">
                          Delivery & returns
                        </Link>
                      </p>
                    </div>
                  ),
                },
                {
                  title: "The Inheritance Card",
                  content: (
                    <p>
                      Every piece is entered in the house register under its archive number ({product.archiveNo}). Add an Inheritance Card above to send it with a few words for the person it is ultimately meant for.
                    </p>
                  ),
                },
              ]}
            />
          </div>
        </ProductExperience>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="gutter max-site border-t border-line py-20 lg:py-28">
          <div className="flex items-end justify-between gap-6">
            <h2 id="related-title" className="font-display text-[clamp(30px,3.4vw,48px)]">
              Worn <span className="italic">alongside</span>
            </h2>
            {collection && (
              <Link href={`/collections/${collection.slug}`} className="link-line label shrink-0">
                {collection.name}
              </Link>
            )}
          </div>
          <ul className="mt-10 grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-4 lg:gap-x-6">
            {related.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} sizes="(min-width:768px) 25vw, 50vw" />
              </li>
            ))}
          </ul>
        </section>
      )}
      <RecentlyViewed excludeId={product.id} />
    </>
  );
}
