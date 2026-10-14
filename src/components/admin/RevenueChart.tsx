"use client";

import { useId, useState } from "react";
import { formatPrice } from "@/lib/format";

/**
 * Single-series bar chart (demo revenue per day). One hue — text-safe camel —
 * with 4px rounded data ends, a 2px gap between bars, a recessive grid, a
 * per-bar hover/focus tooltip with a hit target larger than the mark, and a
 * table alternative for screen readers.
 */
export function RevenueChart({ data }: { data: { day: string; revenue: number; orders: number }[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const id = useId();
  const W = 720;
  const H = 240;
  const pad = { t: 16, r: 8, b: 28, l: 56 };
  const max = Math.max(...data.map((d) => d.revenue), 1);
  const niceMax = Math.ceil(max / 50000) * 50000;
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;
  const slot = innerW / data.length;
  const barW = Math.max(6, Math.min(30, slot - 2 - slot * 0.35));
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(niceMax * f));
  const y = (v: number) => pad.t + innerH - (v / niceMax) * innerH;
  const active = hover !== null ? data[hover] : null;

  return (
    <figure className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-labelledby={`${id}-t`} aria-describedby={`${id}-table`}>
        <title id={`${id}-t`}>Demo revenue per day, last 14 days</title>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke="rgb(20 18 16 / 0.08)" strokeWidth={1} />
            <text x={pad.l - 10} y={y(t)} dy="0.32em" textAnchor="end" fontSize="10.5" fill="#6f655a">
              {t === 0 ? "0" : `₦${t / 1000}k`}
            </text>
          </g>
        ))}
        {data.map((d, i) => {
          const x = pad.l + i * slot + (slot - barW) / 2;
          const h = Math.max(d.revenue ? 3 : 0, (d.revenue / niceMax) * innerH);
          const top = pad.t + innerH - h;
          const r = Math.min(4, h / 2, barW / 2);
          const path = h
            ? `M${x},${pad.t + innerH} V${top + r} Q${x},${top} ${x + r},${top} H${x + barW - r} Q${x + barW},${top} ${x + barW},${top + r} V${pad.t + innerH} Z`
            : "";
          return (
            <g key={d.day}>
              {path && <path d={path} fill={hover === null || hover === i ? "#8a5a2b" : "rgb(138 90 43 / 0.35)"} className="transition-[fill] duration-200" />}
              {(i % 2 === 0 || data.length <= 8) && (
                <text x={x + barW / 2} y={H - 8} textAnchor="middle" fontSize="10.5" fill="#6f655a">
                  {d.day.split(" ")[0]}
                </text>
              )}
              {/* Hit target: the whole column, larger than the mark */}
              <rect
                x={pad.l + i * slot}
                y={pad.t}
                width={slot}
                height={innerH}
                fill="transparent"
                tabIndex={0}
                role="img"
                aria-label={`${d.day}: ${formatPrice(d.revenue)}, ${d.orders} orders`}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                className="cursor-default outline-none"
              />
            </g>
          );
        })}
        <line x1={pad.l} x2={W - pad.r} y1={pad.t + innerH} y2={pad.t + innerH} stroke="rgb(20 18 16 / 0.3)" strokeWidth={1} />
      </svg>
      {active && hover !== null && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-[3px] bg-ink px-3 py-2 text-[12px] text-ivory shadow-lg"
          style={{ left: `${((pad.l + hover * slot + slot / 2) / W) * 100}%`, top: `${(y(active.revenue) / H) * 100}%`, marginTop: -8 }}
          role="status"
        >
          <p className="text-ivory/70">{active.day}</p>
          <p className="font-medium tabular-nums">{formatPrice(active.revenue)}</p>
          <p className="text-ivory/70">
            {active.orders} {active.orders === 1 ? "order" : "orders"}
          </p>
        </div>
      )}
      <table id={`${id}-table`} className="sr-only">
        <caption>Demo revenue per day</caption>
        <thead>
          <tr>
            <th>Day</th>
            <th>Revenue</th>
            <th>Orders</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.day}>
              <td>{d.day}</td>
              <td>{formatPrice(d.revenue)}</td>
              <td>{d.orders}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
