import Link from "next/link";
import { products } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/ui/Reveal";

const curated = [
  "the-art-of-flight-silk-scarf",
  "nyves-coquette-headband",
  "kn-forms-orbis-tee",
  "the-randolph-pajama-duo",
  "monogram-silk-scarf",
  "monogram-camp-shirt-trouser-set",
];

export function FeaturedProducts() {
  const list = curated.map((slug) => products.find((p) => p.slug === slug)!).filter(Boolean);
  return (
    <section aria-labelledby="featured-title" className="border-t border-line py-24 lg:py-32">
      <div className="gutter max-site flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <Reveal>
          <p className="eyebrow text-taupe">The Register</p>
          <h2 id="featured-title" className="mt-4 font-display text-[clamp(36px,4.4vw,62px)]">
            Pieces worth <span className="italic">passing on.</span>
          </h2>
        </Reveal>
        <Link href="/shop" className="link-line label shrink-0 self-start sm:self-end">
          View all pieces
        </Link>
      </div>

      <div className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 sm:scroll-px-7 sm:gap-6 sm:px-7 lg:scroll-px-12 lg:px-12 2xl:px-[max(72px,calc((100vw-1680px)/2+72px))]">
        {list.map((p) => (
          <div key={p.id} className="w-[72vw] max-w-[380px] shrink-0 snap-start sm:w-[44vw] lg:w-[calc((100vw-96px-72px)/4)]">
            <ProductCard product={p} sizes="(min-width:1024px) 25vw, (min-width:640px) 44vw, 72vw" preload={false} aspect="aspect-[4/5]" />
          </div>
        ))}
      </div>
    </section>
  );
}
