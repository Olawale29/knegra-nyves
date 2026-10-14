import { site } from "@/data/site";
import type { CurrencyCode } from "@/lib/types";

const formatters = new Map<string, Intl.NumberFormat>();

export function formatPrice(amount: number, currency: CurrencyCode = site.currency): string {
  const key = currency;
  let f = formatters.get(key);
  if (!f) {
    f = new Intl.NumberFormat(currency === "NGN" ? "en-NG" : "en-GB", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    });
    formatters.set(key, f);
  }
  return f.format(amount);
}

export function formatDate(iso: string): string {
  return new Date(iso + (iso.length === 10 ? "T12:00:00" : "")).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}
