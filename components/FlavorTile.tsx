import Image from "next/image";
import Link from "next/link";
import { Flavor, formatPrice, categoryColors } from "@/lib/flavors";
import { basePath } from "@/lib/basePath";

const badgeColor: Record<string, string> = {
  Bestseller: "text-accent border-accent-dim",
  Neu: "text-accent-2 border-accent-2/40",
  Limitiert: "text-fg border-fg/30",
};

export default function FlavorTile({ flavor, index }: { flavor: Flavor; index: number }) {
  const color = categoryColors[flavor.category];

  return (
    <Link
      href={`/geschmack/${flavor.slug}`}
      className="flavor-tile tile-border group relative flex min-h-[280px] flex-col justify-between overflow-hidden rounded-2xl bg-bg-elevated/40 sm:min-h-[300px]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-bg-elevated">
        <Image
          src={`${basePath}/flavors/${flavor.slug}.webp`}
          alt={flavor.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, rgba(7,8,11,0.55) 0%, transparent 30%, transparent 55%, var(--bg) 100%), radial-gradient(60% 50% at 75% 20%, color-mix(in srgb, ${color} 30%, transparent), transparent 70%)`,
          }}
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          <span className="font-mono text-[11px] text-fg-muted">
            {String(index + 1).padStart(2, "0")}
          </span>
          {flavor.badge && (
            <span
              className={`rounded-full border bg-bg/60 px-2 py-0.5 font-mono text-[10px] backdrop-blur-sm ${badgeColor[flavor.badge]}`}
            >
              {flavor.badge}
            </span>
          )}
        </div>
      </div>

      <div className="relative px-5 pb-5 sm:px-6 sm:pb-6">
        <h3 className="font-display text-xl leading-tight transition-colors group-hover:text-accent sm:text-2xl">
          {flavor.name}
        </h3>
        <p className="mt-2 font-sans text-sm" style={{ color }}>
          {flavor.notes.join(" · ")}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
          <span className="font-mono text-[11px] text-fg-muted">{flavor.intensity}</span>
          <span className="font-mono text-sm text-fg">
            ab {formatPrice(Math.min(flavor.disposablePrice, flavor.liquidPrice))}
          </span>
        </div>
      </div>
    </Link>
  );
}
