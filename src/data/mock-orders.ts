import type { Customer, MockOrder, OrderLine, OrderStatus } from "@/lib/types";

/**
 * DEMO DATA ONLY. These customers and orders are fictional and exist to make
 * the account area and admin prototype feel real. No real person or sale is
 * represented here.
 */

export const customers: Customer[] = [
  { id: "c-01", firstName: "Adaeze", lastName: "Okafor", email: "adaeze.o@example.com", city: "Lagos", joined: "2025-01-12", orders: 6, lifetimeValue: 318000, tier: "Icon" },
  { id: "c-02", firstName: "Tobi", lastName: "Adeyemi", email: "tobi.adeyemi@example.com", city: "Lagos", joined: "2025-03-04", orders: 3, lifetimeValue: 142000, tier: "Returning" },
  { id: "c-03", firstName: "Zainab", lastName: "Bello", email: "zainab.b@example.com", city: "Abuja", joined: "2025-04-21", orders: 2, lifetimeValue: 98000, tier: "Returning" },
  { id: "c-04", firstName: "Kelechi", lastName: "Nwosu", email: "kelechi.n@example.com", city: "Port Harcourt", joined: "2025-06-02", orders: 1, lifetimeValue: 45000, tier: "New" },
  { id: "c-05", firstName: "Folake", lastName: "Ogunleye", email: "folake.og@example.com", city: "Ibadan", joined: "2025-07-15", orders: 4, lifetimeValue: 206000, tier: "Icon" },
  { id: "c-06", firstName: "Emeka", lastName: "Eze", email: "emeka.eze@example.com", city: "Enugu", joined: "2025-08-30", orders: 1, lifetimeValue: 25000, tier: "New" },
  { id: "c-07", firstName: "Simi", lastName: "Lawal", email: "simi.lawal@example.com", city: "Lagos", joined: "2025-10-11", orders: 2, lifetimeValue: 132000, tier: "Returning" },
  { id: "c-08", firstName: "Ifeoma", lastName: "Chukwu", email: "ifeoma.c@example.com", city: "Lagos", joined: "2026-01-05", orders: 1, lifetimeValue: 85000, tier: "New" },
  { id: "c-09", firstName: "Bayo", lastName: "Afolabi", email: "bayo.a@example.com", city: "Abeokuta", joined: "2026-02-18", orders: 2, lifetimeValue: 77000, tier: "Returning" },
  { id: "c-10", firstName: "Amara", lastName: "Obi", email: "amara.obi@example.com", city: "Lagos", joined: "2026-05-27", orders: 1, lifetimeValue: 12000, tier: "New" },
];

const line = (productId: string, name: string, variant: string, quantity: number, unitPrice: number, inscription?: string): OrderLine => ({
  productId,
  name,
  variant,
  quantity,
  unitPrice,
  inscription,
});

type Seed = [string, string, OrderStatus, string, OrderLine[], string, number];

const seeds: Seed[] = [
  ["KN-D1048", "2026-10-12", "Processing", "c-01", [line("p-flight", "The Art of Flight Silk Scarf", "Ivory", 1, 85000, "For Nneka — the first of many."), line("p-coquette", "NYVES Coquette Headband", "Set of two · Noir", 1, 12000)], "Lagos courier", 4500],
  ["KN-D1047", "2026-10-11", "Pending", "c-07", [line("p-coord-trouser", "Monogram Camp Shirt & Trouser Set", "Camel · M", 1, 145000)], "Lagos courier", 4500],
  ["KN-D1046", "2026-10-09", "Dispatched", "c-05", [line("p-orbis", "KN Forms — Orbis Tee", "Noir · L", 1, 45000), line("p-cap", "KN Baseball Cap", "Emerald", 1, 25000)], "Nationwide delivery", 9000],
  ["KN-D1045", "2026-10-07", "Delivered", "c-02", [line("p-randolph", "The Randolph Pajama Duo", "Rouge stripe · S", 1, 95000)], "Lagos courier", 4500],
  ["KN-D1044", "2026-10-04", "Delivered", "c-03", [line("p-monogram-scarf", "Monogram Silk Scarf", "Noir", 1, 75000), line("p-coquette", "NYVES Coquette Headband", "Single · Olive", 1, 7000)], "Nationwide delivery", 9000],
  ["KN-D1043", "2026-10-02", "Delivered", "c-09", [line("p-embossed", "Signature Embossed Tee", "Blanc · XL", 1, 38000), line("p-short", "Sport Short", "Noir · L", 1, 32000)], "Nationwide delivery", 9000],
  ["KN-D1042", "2026-09-29", "Cancelled", "c-06", [line("p-cap", "KN Baseball Cap", "Sky", 1, 25000)], "Nationwide delivery", 9000],
  ["KN-D1041", "2026-09-26", "Delivered", "c-01", [line("p-coquette", "NYVES Coquette Headband", "Set of four · Noir", 1, 25000)], "Collect from the studio", 0],
  ["KN-D1040", "2026-09-22", "Delivered", "c-08", [line("p-flight", "The Art of Flight Silk Scarf", "Ivory", 1, 85000)], "Lagos courier", 4500],
  ["KN-D1039", "2026-09-18", "Delivered", "c-10", [line("p-coquette", "NYVES Coquette Headband", "Set of two · Cobalt", 1, 12000)], "Lagos courier", 4500],
  ["KN-D1038", "2026-09-15", "Delivered", "c-05", [line("p-quadrum", "KN Forms — Quadrum Tee", "Noir · M", 2, 45000)], "Nationwide delivery", 9000],
  ["KN-D1037", "2026-09-11", "Delivered", "c-07", [line("p-monogram-scarf", "Monogram Silk Scarf", "Camel", 1, 75000)], "Lagos courier", 4500],
];

const customerById = new Map(customers.map((c) => [c.id, c]));

export const mockOrders: MockOrder[] = seeds.map(([reference, placedAt, status, customerId, lines, method, fee], i) => {
  const c = customerById.get(customerId)!;
  const subtotal = lines.reduce((s, l) => s + l.quantity * l.unitPrice, 0);
  return {
    id: `o-${String(i + 1).padStart(3, "0")}`,
    reference,
    placedAt,
    customerId,
    customerName: `${c.firstName} ${c.lastName}`,
    email: c.email,
    status,
    lines,
    delivery: { method, fee },
    address: {
      firstName: c.firstName,
      lastName: c.lastName,
      line1: "Demo address — not a real location",
      city: c.city,
      state: c.city === "Lagos" ? "Lagos" : c.city,
      country: "Nigeria",
      phone: "+234 000 000 0000",
    },
    total: subtotal + fee,
    demo: true,
  };
});

/** The signed-in demo customer for the account area. */
export const demoCustomerId = "c-01";

/** Demo daily revenue for the admin chart (last 14 days, NGN). */
export const demoRevenueSeries: { day: string; revenue: number; orders: number }[] = [
  { day: "01 Oct", revenue: 70000, orders: 1 },
  { day: "02 Oct", revenue: 79000, orders: 1 },
  { day: "03 Oct", revenue: 0, orders: 0 },
  { day: "04 Oct", revenue: 91000, orders: 1 },
  { day: "05 Oct", revenue: 38000, orders: 1 },
  { day: "06 Oct", revenue: 24000, orders: 2 },
  { day: "07 Oct", revenue: 99500, orders: 1 },
  { day: "08 Oct", revenue: 57000, orders: 2 },
  { day: "09 Oct", revenue: 79000, orders: 1 },
  { day: "10 Oct", revenue: 12000, orders: 1 },
  { day: "11 Oct", revenue: 149500, orders: 1 },
  { day: "12 Oct", revenue: 101500, orders: 1 },
  { day: "13 Oct", revenue: 64000, orders: 3 },
  { day: "14 Oct", revenue: 32500, orders: 2 },
];
