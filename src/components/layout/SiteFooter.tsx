import Link from "next/link";
import { collections } from "@/data/collections";
import { site } from "@/data/site";
import { RequestAccessForm } from "@/components/layout/RequestAccessForm";
import { Wordmark } from "@/components/ui/primitives";

const groups = [
  {
    title: "Collections",
    links: collections.map((c) => ({ label: c.name, href: `/collections/${c.slug}` })),
  },
  {
    title: "The House",
    links: [
      { label: "Our story", href: "/the-house" },
      { label: "The Inheritance Register", href: "/the-house#register" },
      { label: "Wishlist", href: "/wishlist" },
      { label: "Account", href: "/account" },
    ],
  },
  {
    title: "Client care",
    links: [
      { label: "Contact & FAQ", href: "/client-care" },
      { label: "Delivery & returns", href: "/policies/delivery-returns" },
      { label: "Privacy", href: "/policies/privacy" },
      { label: "Terms", href: "/policies/terms" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="on-dark mt-auto bg-ink text-ivory">
      <div className="gutter max-site pb-10 pt-20 lg:pt-28">
        <div className="grid gap-14 lg:grid-cols-12">
          <div id="access" className="scroll-mt-28 lg:col-span-5">
            <p className="eyebrow text-camel">Request access</p>
            <p className="mt-5 max-w-md font-display text-[38px] leading-[1.05] sm:text-[46px]">Join the Icons — first word on every drop.</p>
            <RequestAccessForm />
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-6 lg:col-start-7">
            {groups.map((g) => (
              <div key={g.title}>
                <p className="eyebrow text-ivory/65">{g.title}</p>
                <ul className="mt-5 space-y-2.5 text-[14px]">
                  {g.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="link-reveal text-ivory/85 hover:text-ivory">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-24 border-t border-white/12 pt-10">
          <Wordmark stacked className="w-full max-w-[1100px] text-ivory/95" />
        </div>

        <div className="mt-10 flex flex-col gap-4 text-[12px] text-ivory/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {2026} {site.name} · {site.city}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a href={site.instagram.url} target="_blank" rel="noreferrer" className="link-reveal hover:text-ivory">
              Instagram {site.instagram.handle}
            </a>
            <a href={`mailto:${site.email}`} className="link-reveal hover:text-ivory">
              {site.email}
            </a>
          </div>
        </div>
        <p className="mt-6 max-w-3xl text-[11.5px] leading-relaxed text-ivory/65">
          Frontend demonstration. Prices marked “illustrative”, delivery options, stock levels and account data are demo content; no payment is taken and no order is placed.
        </p>
      </div>
    </footer>
  );
}
