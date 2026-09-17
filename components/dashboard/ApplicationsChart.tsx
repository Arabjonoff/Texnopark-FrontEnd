"use client";

import { useState } from "react";
import { formatDate } from "./ui";

type Point = { date: string; count: number };

const HEIGHT = 180;
const PAD = { top: 12, right: 8, bottom: 26, left: 32 };

function niceMax(value: number) {
  if (value <= 4) return 4;
  const step = Math.pow(10, Math.floor(Math.log10(value)));
  return Math.ceil(value / step) * step;
}

/**
 * 30 kunlik arizalar ustunli grafigi (bitta seriya — legend shart emas, sarlavha nomlaydi).
 * Ustun: <=24px, yuqori uchi 4px yumaloq; hover/fokusda tooltip; jadval ko'rinishi <details> ichida.
 */
export function ApplicationsChart({ data }: { data: Point[] }) {
  const [active, setActive] = useState<number | null>(null);
  const width = 720;
  const innerW = width - PAD.left - PAD.right;
  const innerH = HEIGHT - PAD.top - PAD.bottom;
  const max = niceMax(Math.max(0, ...data.map((d) => d.count)));
  const slot = innerW / data.length;
  const barW = Math.min(24, slot - 2);
  const ticks = [0, max / 2, max];
  const total = data.reduce((sum, d) => sum + d.count, 0);

  const point = active !== null ? data[active] : null;
  const pointX = active !== null ? PAD.left + slot * active + slot / 2 : 0;

  return (
    <div>
      <div className="relative">
        <svg
          viewBox={`0 0 ${width} ${HEIGHT}`}
          className="h-auto w-full overflow-visible"
          role="img"
          aria-label={`So'nggi 30 kunda ${total} ta ariza. Kunlik qiymatlar pastdagi jadvalda.`}
          onMouseLeave={() => setActive(null)}
        >
          {ticks.map((tick) => {
            const y = PAD.top + innerH - (tick / max) * innerH;
            return (
              <g key={tick}>
                <line x1={PAD.left} x2={width - PAD.right} y1={y} y2={y} className="stroke-dash-border" strokeWidth={1} />
                <text x={PAD.left - 8} y={y} dy="0.32em" textAnchor="end" className="fill-dash-muted text-[11px] tabular-nums">
                  {Number.isInteger(tick) ? tick : tick.toFixed(1)}
                </text>
              </g>
            );
          })}

          {data.map((d, i) => {
            const h = d.count === 0 ? 0 : Math.max(3, (d.count / max) * innerH);
            const x = PAD.left + slot * i + (slot - barW) / 2;
            const y = PAD.top + innerH - h;
            const r = Math.min(4, h, barW / 2);
            return (
              <g key={d.date}>
                {h > 0 && (
                  <path
                    // Faqat yuqori burchaklar yumaloq, asos to'g'ri
                    d={`M${x},${y + h} V${y + r} Q${x},${y} ${x + r},${y} H${x + barW - r} Q${x + barW},${y} ${x + barW},${y + r} V${y + h} Z`}
                    className="fill-dash-chart transition-opacity"
                    opacity={active === null || active === i ? 1 : 0.45}
                  />
                )}
                {/* Ustundan kattaroq hover/fokus maydoni */}
                <rect
                  x={PAD.left + slot * i}
                  y={PAD.top}
                  width={slot}
                  height={innerH}
                  fill="transparent"
                  tabIndex={0}
                  aria-label={`${formatDate(d.date)}: ${d.count} ta ariza`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  className="cursor-default outline-none"
                />
              </g>
            );
          })}

          {[0, Math.floor(data.length / 2), data.length - 1].map((i) => (
            <text key={i} x={PAD.left + slot * i + slot / 2} y={HEIGHT - 6} textAnchor="middle" className="fill-dash-muted text-[11px]">
              {formatDate(data[i].date).split(" ").slice(0, 2).join(" ")}
            </text>
          ))}
        </svg>

        {total === 0 && (
          <p className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-sm text-dash-muted">
            So&apos;nggi 30 kunda ariza kelmagan
          </p>
        )}

        {point && (
          <div
            className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 -translate-y-2 whitespace-nowrap rounded-lg border border-dash-border bg-dash-surface px-3 py-2 text-xs shadow-lg"
            // Chetlarda tooltip grafikdan chiqib ketmasin
            style={{ left: `${Math.min(90, Math.max(10, (pointX / width) * 100))}%` }}
          >
            <p className="text-dash-muted">{formatDate(point.date)}</p>
            <p className="font-semibold text-dash-text">{point.count} ta ariza</p>
          </div>
        )}
      </div>

      <details className="mt-2 text-sm">
        <summary className="cursor-pointer text-dash-muted hover:text-dash-text">Jadval ko&apos;rinishida</summary>
        <div className="mt-2 max-h-48 overflow-y-auto rounded-lg border border-dash-border">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-dash-subtle text-xs text-dash-muted">
              <tr>
                <th className="px-3 py-1.5 font-medium">Sana</th>
                <th className="px-3 py-1.5 text-right font-medium">Arizalar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dash-border">
              {[...data].reverse().map((d) => (
                <tr key={d.date}>
                  <td className="px-3 py-1.5 text-dash-muted">{formatDate(d.date)}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums text-dash-text">{d.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
