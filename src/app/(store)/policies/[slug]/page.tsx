import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { policies } from "@/data/content";
import { Breadcrumbs, DemoTag } from "@/components/ui/primitives";

type Slug = keyof typeof policies;

export function generateStaticParams() {
  return Object.keys(policies).map((slug) => ({ slug }));
}

export async function generateMetadata(props: PageProps<"/policies/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const p = policies[slug as Slug];
  return p ? { title: p.title, alternates: { canonical: `/policies/${slug}` } } : {};
}

export default async function PolicyPage(props: PageProps<"/policies/[slug]">) {
  const { slug } = await props.params;
  const policy = policies[slug as Slug];
  if (!policy) notFound();
  return (
    <article className="gutter max-site pb-24 pt-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Client care", href: "/client-care" }, { label: policy.title }]} />
      <div className="mx-auto mt-12 max-w-2xl">
        <DemoTag>Placeholder — official text to be supplied</DemoTag>
        <h1 className="mt-5 font-display text-[clamp(44px,5.4vw,80px)] font-light leading-[0.95]">{policy.title}</h1>
        <p className="mt-6 text-[15px] leading-relaxed text-ink-soft">{policy.intro}</p>
        <div className="mt-12 space-y-10">
          {policy.sections.map((s) => (
            <section key={s.h}>
              <h2 className="font-display text-[28px]">{s.h}</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{s.p}</p>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
