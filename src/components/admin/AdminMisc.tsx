"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import { collections } from "@/data/collections";
import { customers } from "@/data/mock-orders";
import { announcements } from "@/data/site";
import { cx, formatDate, formatPrice } from "@/lib/format";
import { useAdmin, type DemoCampaign } from "@/store";
import { DemoTag } from "@/components/ui/primitives";
import { AdminTitle, Panel } from "@/components/admin/AdminShell";
import { useAdminProducts } from "@/components/admin/useAdminData";

// ───────────────────────── Collections ─────────────────────────
export function AdminCollections() {
  const products = useAdminProducts();
  return (
    <div>
      <AdminTitle title="Collections" kicker={`${collections.length} collections`} />
      <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {collections.map((c) => {
          const items = products.filter((p) => p.collection === c.slug);
          return (
            <li key={c.slug} className="border border-line bg-ivory">
              <div className="relative aspect-[16/9] overflow-hidden bg-cream">
                <Image src={c.hero.src} alt={c.hero.alt} fill sizes="(min-width:1280px) 30vw, 50vw" quality={70} className="object-cover" />
              </div>
              <div className="p-5">
                <p className="eyebrow text-taupe">{c.kicker}</p>
                <h2 className="mt-2 font-display text-[28px] leading-none">{c.name}</h2>
                <p className="mt-3 line-clamp-2 text-[13px] text-ink-soft">{c.intro}</p>
                <div className="mt-4 flex items-center justify-between text-[12.5px]">
                  <span className="text-taupe">
                    {items.length} {items.length === 1 ? "piece" : "pieces"} · copy {c.copyProvenance === "verified" ? "from the house" : "placeholder"}
                  </span>
                  <Link href={`/collections/${c.slug}`} className="link-reveal">
                    View
                  </Link>
                </div>
                <div className="mt-4 flex -space-x-2">
                  {items.slice(0, 5).map((p) =>
                    p.images[0] ? (
                      <span key={p.id} className="relative size-9 overflow-hidden rounded-full ring-2 ring-ivory">
                        <Image src={p.images[0].src} alt="" fill sizes="36px" quality={60} className="object-cover" />
                      </span>
                    ) : null,
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ───────────────────────── Customers ─────────────────────────
export function AdminCustomers() {
  const [q, setQ] = useState("");
  const term = q.trim().toLowerCase();
  const list = customers.filter((c) => !term || `${c.firstName} ${c.lastName} ${c.email} ${c.city}`.toLowerCase().includes(term));
  return (
    <div>
      <AdminTitle title="Customers" kicker={`${customers.length} clients · fictional demo records`} />
      <label className="mb-5 flex min-h-10 w-full items-center gap-2 border border-line bg-ivory px-3 sm:w-80">
        <Search className="size-4 text-taupe" strokeWidth={1.4} aria-hidden />
        <span className="sr-only">Search customers</span>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, email or city" className="min-w-0 flex-1 bg-transparent text-[13px] outline-none" />
      </label>
      <Panel>
        <div className="relative overflow-x-auto">
          <table className="w-full min-w-[700px] text-[13px]">
            <thead>
              <tr className="border-b border-line text-left text-[11.5px] text-taupe">
                <th scope="col" className="px-5 py-3 font-normal">Client</th>
                <th scope="col" className="px-5 py-3 font-normal">City</th>
                <th scope="col" className="px-5 py-3 font-normal">Since</th>
                <th scope="col" className="px-5 py-3 font-normal">Orders</th>
                <th scope="col" className="px-5 py-3 font-normal">Lifetime value</th>
                <th scope="col" className="px-5 py-3 font-normal">Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {list.map((c) => (
                <tr key={c.id} className="hover:bg-cream/50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="grid size-9 place-items-center rounded-full bg-cream text-[12px] font-medium" aria-hidden>
                        {c.firstName[0]}
                        {c.lastName[0]}
                      </span>
                      <span>
                        {c.firstName} {c.lastName}
                        <span className="block text-[12px] text-taupe">{c.email}</span>
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3">{c.city}</td>
                  <td className="px-5 py-3 text-taupe">{formatDate(c.joined)}</td>
                  <td className="px-5 py-3 tabular-nums">{c.orders}</td>
                  <td className="px-5 py-3 tabular-nums">{formatPrice(c.lifetimeValue)}</td>
                  <td className="px-5 py-3">
                    <span className={cx("rounded-full px-2.5 py-0.5 text-[11.5px] font-medium", c.tier === "Icon" ? "bg-camel/20 text-camel-deep" : c.tier === "Returning" ? "bg-cream" : "bg-ok/10 text-ok")}>{c.tier}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

// ───────────────────────── Campaigns ─────────────────────────
const placements: DemoCampaign["placement"][] = ["Homepage hero", "Announcement bar", "Editorial band", "Collection banner"];
const states: DemoCampaign["status"][] = ["Live", "Scheduled", "Draft"];

export function AdminCampaigns() {
  const campaigns = useAdmin((s) => s.campaigns);
  const upsert = useAdmin((s) => s.upsertCampaign);
  const remove = useAdmin((s) => s.removeCampaign);
  const [title, setTitle] = useState("");
  const [placement, setPlacement] = useState<DemoCampaign["placement"]>("Announcement bar");
  const [starts, setStarts] = useState("2026-11-29");
  const [err, setErr] = useState(false);

  return (
    <div>
      <AdminTitle title="Campaigns & content" kicker="What the storefront is saying" />
      <div className="grid gap-6 xl:grid-cols-3">
        <Panel title="Campaign calendar" className="xl:col-span-2">
          <ul className="divide-y divide-line">
            {campaigns.map((c) => (
              <li key={c.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-medium">{c.title}</p>
                  <p className="text-[12px] text-taupe">
                    {c.placement} · from {formatDate(c.starts)}
                  </p>
                </div>
                <label className="sr-only" htmlFor={`cs-${c.id}`}>
                  Status of {c.title}
                </label>
                <select id={`cs-${c.id}`} value={c.status} onChange={(e) => upsert({ ...c, status: e.target.value as DemoCampaign["status"] })} className={cx("cursor-pointer rounded-full border px-2.5 py-1 text-[12px]", c.status === "Live" ? "border-ok/40 text-ok" : c.status === "Scheduled" ? "border-camel/60 text-camel-deep" : "border-line-strong text-taupe")}>
                  {states.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                <button type="button" onClick={() => remove(c.id)} className="grid size-9 place-items-center text-taupe hover:text-danger" aria-label={`Delete ${c.title}`}>
                  <Trash2 className="size-4" strokeWidth={1.4} />
                </button>
              </li>
            ))}
            {campaigns.length === 0 && <li className="p-6 text-[13px] text-taupe">No campaigns. Create one to plan the next drop.</li>}
          </ul>
        </Panel>

        <Panel title="Plan a campaign">
          <form
            className="space-y-4 p-5"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              if (!title.trim()) return setErr(true);
              upsert({ id: `cmp-${Date.now()}`, title: title.trim(), placement, status: "Scheduled", starts });
              setTitle("");
              setErr(false);
            }}
          >
            <div>
              <label htmlFor="cp-title" className="mb-1.5 block text-[12.5px] text-ink-soft">
                Title
              </label>
              <input id="cp-title" className="field" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="The Inheritance Drop — chapter two" aria-invalid={err} />
              {err && <p className="mt-1.5 text-[12.5px] text-danger">Give the campaign a title.</p>}
            </div>
            <div>
              <label htmlFor="cp-place" className="mb-1.5 block text-[12.5px] text-ink-soft">
                Placement
              </label>
              <select id="cp-place" className="field" value={placement} onChange={(e) => setPlacement(e.target.value as DemoCampaign["placement"])}>
                {placements.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="cp-start" className="mb-1.5 block text-[12.5px] text-ink-soft">
                Starts
              </label>
              <input id="cp-start" type="date" className="field" value={starts} onChange={(e) => setStarts(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-ink min-h-11 w-full">
              <Plus className="size-4" strokeWidth={1.5} /> Schedule
            </button>
            <DemoTag>Saved in this browser only</DemoTag>
          </form>
        </Panel>
      </div>

      <Panel title="Announcement bar · live copy" className="mt-6">
        <ul className="divide-y divide-line">
          {announcements.map((a) => (
            <li key={a.text} className="flex items-center justify-between gap-4 px-5 py-3 text-[13px]">
              <span className="eyebrow text-[10px]">{a.text}</span>
              <span className="text-[12px] text-taupe">{a.href}</span>
            </li>
          ))}
        </ul>
        <p className="border-t border-line px-5 py-3 text-[12px] text-taupe">Edited in src/data/site.ts for this demo; managed here in the full platform.</p>
      </Panel>
    </div>
  );
}
