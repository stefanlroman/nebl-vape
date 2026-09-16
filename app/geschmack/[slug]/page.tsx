import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import {
  flavors,
  getFlavor,
  getRelatedFlavors,
  categories,
  categoryColors,
} from "@/lib/flavors";
import VariantPicker from "@/components/VariantPicker";
import FlavorTile from "@/components/FlavorTile";
import { basePath } from "@/lib/basePath";

export function generateStaticParams() {
  return flavors.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const flavor = getFlavor(slug);
  if (!flavor) return {};
  return {
    title: `${flavor.name} — NEBL`,
    description: flavor.description,
  };
}

export default async function FlavorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const flavor = getFlavor(slug);
  if (!flavor) notFound();

  const related = getRelatedFlavors(flavor);
  const categoryLabel = categories.find((c) => c.id === flavor.category)?.label;
  const color = categoryColors[flavor.category];

  return (
    <div className="px-6 pb-24 pt-32 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <Link href="/#geschmaecker" className="font-sans text-sm text-fg-muted hover:text-accent">
          ← Zurück zu allen Geschmäckern
        </Link>

        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <div className="relative mb-8 aspect-square w-full overflow-hidden rounded-2xl border border-line bg-bg-elevated sm:aspect-[4/3]">
              <Image
                src={`${basePath}/flavors/${flavor.slug}.webp`}
                alt={flavor.name}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(180deg, rgba(7,8,11,0.4) 0%, transparent 32%, transparent 50%, rgba(7,8,11,0.9) 100%), radial-gradient(55% 45% at 72% 78%, color-mix(in srgb, ${color} 22%, transparent), transparent 70%)`,
                }}
              />
              {/* Lettering lives on the photo, not below it. */}
              <div className="absolute inset-x-0 bottom-0 p-6 pb-8 sm:p-8 sm:pb-10">
                <span
                  className="font-mono text-xs font-medium uppercase tracking-[0.22em]"
                  style={{ color, textShadow: "0 1px 8px rgba(0,0,0,0.6)" }}
                >
                  {categoryLabel}
                </span>
                <h1
                  className="flavor-title-cyber mt-1 text-5xl sm:text-6xl"
                  style={{ "--tint": color } as CSSProperties}
                >
                  {flavor.name}
                </h1>
              </div>
            </div>

            <p className="font-sans text-sm text-fg-muted">{flavor.notes.join(" · ")}</p>
            <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-fg-muted">
              {flavor.description}
            </p>

            <div className="mt-10">
              <span className="font-sans text-sm text-fg-muted">Profil</span>
              <ul className="mt-4 flex flex-col gap-3">
                <li className="flex items-start justify-between gap-3 border-t border-line pt-3 font-sans text-sm text-fg">
                  <span className="text-fg-muted">Intensität</span>
                  <span>{flavor.intensity}</span>
                </li>
                <li className="flex items-start justify-between gap-3 border-t border-line pt-3 font-sans text-sm text-fg">
                  <span className="text-fg-muted">Aromen</span>
                  <span className="text-right">{flavor.notes.join(", ")}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="h-fit rounded-2xl border border-line bg-bg-elevated/40 p-6 sm:p-8">
            <VariantPicker flavor={flavor} />

            <p className="mt-6 border-t border-line pt-5 font-sans text-xs leading-relaxed text-fg-muted">
              Enthält Nikotin. Nikotin erzeugt eine hohe Abhängigkeit. Verkauf
              ausschließlich an Personen ab 18 Jahren.
            </p>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-24">
            <h2 className="font-display mb-6 text-2xl">Ähnliche Geschmäcker</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {related.map((f, i) => (
                <FlavorTile key={f.slug} flavor={f} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
