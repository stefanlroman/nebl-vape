"use client";

import { ringFlavors } from "@/lib/flavors";
import { useDragScroll } from "@/lib/useDragScroll";
import FlavorTile from "./FlavorTile";

const CARD_WIDTH = 320;

export default function BestsellerShowcase() {
  const { scrollerRef, scrollBy, onPointerDown, onPointerMove, endDrag } =
    useDragScroll(CARD_WIDTH);

  return (
    <section className="relative overflow-hidden border-y border-line py-20 sm:py-24">
      <div className="mx-auto flex max-w-7xl items-end justify-between gap-6 px-6 sm:px-10">
        <div className="max-w-xl">
          <h2 className="font-display text-3xl sm:text-4xl">
            Die Bestseller, alle auf einen Blick.
          </h2>
          <p className="mt-4 font-sans text-sm leading-relaxed text-fg-muted">
            Ein Querschnitt durch alle sechs Kategorien — die acht Sorten,
            die am häufigsten nachbestellt werden. Zieh die Reihe zur Seite
            oder tippe eine Sorte an.
          </p>
        </div>
        <div className="hidden shrink-0 gap-2 sm:flex">
          <button
            onClick={() => scrollBy(-1)}
            aria-label="Zurück"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line transition-colors hover:border-accent-dim"
          >
            ←
          </button>
          <button
            onClick={() => scrollBy(1)}
            aria-label="Weiter"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line transition-colors hover:border-accent-dim"
          >
            →
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        className="no-scrollbar mt-10 flex snap-x snap-mandatory cursor-grab gap-4 overflow-x-auto px-6 pb-2 active:cursor-grabbing sm:px-10"
      >
        {ringFlavors.map((flavor, i) => (
          <div key={flavor.slug} style={{ width: CARD_WIDTH }} className="shrink-0 snap-start">
            <FlavorTile flavor={flavor} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
