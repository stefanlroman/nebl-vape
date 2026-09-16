import Link from "next/link";
import type { CSSProperties } from "react";
import { categories, categoryColors, flavors } from "@/lib/flavors";

export default function FlavorWall() {
  return (
    <section className="relative border-y border-line py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <div className="max-w-xl">
          <h2 className="font-display text-3xl sm:text-4xl">
            Sechs Kategorien, fünfzig Wolken.
          </h2>
          <p className="mt-4 font-sans text-sm leading-relaxed text-fg-muted">
            Jede Zeile ein eigener Ton — von scharfem Menthol bis warmem
            Tabak. Fahr drüber, um eine Zeile zu halten, oder tippe einen
            Geschmack an.
          </p>
        </div>
      </div>

      <div className="mt-14 flex flex-col gap-3">
        {categories.map((category, rowIndex) => {
          const items = flavors.filter((f) => f.category === category.id);
          const color = categoryColors[category.id];
          const reverse = rowIndex % 2 === 1;

          return (
            <FlavorRow
              key={category.id}
              label={category.label}
              description={category.description}
              color={color}
              reverse={reverse}
              items={items}
            />
          );
        })}
      </div>
    </section>
  );
}

function FlavorRow({
  label,
  description,
  color,
  reverse,
  items,
}: {
  label: string;
  description: string;
  color: string;
  reverse: boolean;
  items: { slug: string; name: string; notes: string[] }[];
}) {
  return (
    <div className="group relative flex flex-col gap-3 py-3 sm:flex-row sm:items-center">
      <div className="flex shrink-0 items-center gap-2 px-6 sm:w-52 sm:justify-end sm:px-0 sm:pr-6 sm:text-right">
        <span
          className="h-1.5 w-1.5 shrink-0 rounded-full sm:order-2"
          style={{ backgroundColor: color }}
        />
        <span className="font-sans text-sm text-fg-muted sm:order-1">{label}</span>
      </div>

      <MarqueeRow items={items} color={color} reverse={reverse} />

      <span className="sr-only">{description}</span>
    </div>
  );
}

// A plain looping flex row using CSS animation — six of these run at once,
// so this stays off Motion's per-frame JS loop (used sparingly elsewhere)
// and keeps scroll smooth even on modest hardware.
function MarqueeRow({
  items,
  color,
  reverse,
}: {
  items: { slug: string; name: string; notes: string[] }[];
  color: string;
  reverse: boolean;
}) {
  const doubled = [...items, ...items];
  return (
    <div className="relative w-full overflow-hidden py-1 sm:w-[calc(100%-13rem)]">
      <div
        className="animate-marquee flex w-max gap-3"
        style={{
          animationDirection: reverse ? "reverse" : "normal",
          animationDuration: `${items.length * 4.5}s`,
        }}
      >
        {doubled.map((item, i) => (
          <Link
            key={`${item.slug}-${i}`}
            href={`/geschmack/${item.slug}`}
            className="flavor-chip flex shrink-0 flex-col gap-0.5 rounded-xl border border-line bg-bg-elevated/40 px-4 py-2.5 transition-colors hover:bg-bg-elevated"
            style={{ "--chip-hover": color } as CSSProperties}
          >
            <span className="font-sans text-sm text-fg">{item.name}</span>
            <span className="font-mono text-[10px] text-fg-muted">
              {item.notes[0]}
            </span>
          </Link>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-bg to-transparent" />
    </div>
  );
}
