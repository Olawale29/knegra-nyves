import type { Metadata } from "next";
import Link from "next/link";
import { faqs } from "@/data/content";
import { site } from "@/data/site";
import { ContactForm } from "@/components/account/ContactForm";
import { Accordion, Breadcrumbs, DemoTag } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Client care",
  description: "Contact KNEGRA NYVES and find answers to common questions.",
  alternates: { canonical: "/client-care" },
};

export default function ClientCarePage() {
  return (
    <div className="gutter max-site pb-24 pt-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Client care" }]} />
      <h1 className="mt-8 font-display text-[clamp(48px,6.6vw,104px)] font-light leading-[0.92]">
        Client <span className="italic">care.</span>
      </h1>

      <div className="mt-16 grid gap-16 lg:grid-cols-12">
        <section aria-labelledby="contact-title" className="lg:col-span-5">
          <h2 id="contact-title" className="label">
            Contact the house
          </h2>
          <dl className="mt-6 space-y-5 text-[15px]">
            <div>
              <dt className="text-[12.5px] text-taupe">Email</dt>
              <dd className="mt-1">
                <a href={`mailto:${site.email}`} className="link-line">
                  {site.email}
                </a>
                <span className="mt-1 block text-[12px] text-taupe">From the house’s draft site — confirm before launch.</span>
              </dd>
            </div>
            <div>
              <dt className="text-[12.5px] text-taupe">Instagram</dt>
              <dd className="mt-1">
                <a href={site.instagram.url} target="_blank" rel="noreferrer" className="link-line">
                  {site.instagram.handle}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[12.5px] text-taupe">Studio</dt>
              <dd className="mt-1">{site.city}</dd>
              <dd className="mt-1">
                <DemoTag>Address & opening hours to be supplied</DemoTag>
              </dd>
            </div>
            <div>
              <dt className="text-[12.5px] text-taupe">Telephone</dt>
              <dd className="mt-1">
                <DemoTag>To be supplied by the house</DemoTag>
              </dd>
            </div>
          </dl>
          <ContactForm />
        </section>

        <section aria-labelledby="faq-title" className="lg:col-span-6 lg:col-start-7">
          <h2 id="faq-title" className="label">
            Frequently asked
          </h2>
          <Accordion className="mt-6" items={faqs.map((f) => ({ title: f.q, content: <p>{f.a}</p> }))} />
          <p className="mt-8 text-[13px] text-taupe">
            See also <Link href="/policies/delivery-returns" className="link-line">Delivery & returns</Link>, <Link href="/policies/privacy" className="link-line">Privacy</Link> and <Link href="/policies/terms" className="link-line">Terms</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
