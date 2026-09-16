"use client";

import { useRef } from "react";
import { flavors, categories, categoryColors, type Category } from "@/lib/flavors";
import FlavorTile from "./FlavorTile";

const CARD_WIDTH = 300;

function CategoryRow({ categoryId, label }: { categoryId: Category; label: string }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const items = flavors.filter((f) => f.category === categoryId);
  const accent = categoryColors[categoryId];

  const scrollBy = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: dir * (CARD_WIDTH + 16) * 2, behavior: "smooth" });
  };

  const drag = useRef<{ startX: number; startScroll: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    const el = scrollerRef.current;
    if (!el) return;
    drag.current = { startX: e.clientX, startScroll: el.scrollLeft };
    el.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current || !scrollerRef.current) return;
    scrollerRef.current.scrollLeft = drag.current.startScroll - (e.clientX - drag.current.startX);
  };
  const endDrag = () => {
    drag.current = null;
  };

  return (
    <div className="mb-14">
      <div className="mb-5 flex items-end justify-between px-6 sm:px-10">
        <div>
          <span className="font-sans text-sm font-medium" style={{ color: accent }}>
            {label}
          </span>
          <h3 className="font-display mt-1 text-2xl sm:text-3xl">
            {items.length} {items.length === 1 ? "Geschmack" : "Geschmäcker"}
          </h3>
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
        className="no-scrollbar flex snap-x snap-mandatory cursor-grab gap-4 overflow-x-auto px-6 pb-2 active:cursor-grabbing sm:px-10"
      >
        {items.map((flavor) => (
          <div key={flavor.slug} style={{ width: CARD_WIDTH }} className="shrink-0 snap-start">
            <FlavorTile flavor={flavor} index={flavor.id - 1} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FlavorCatalog() {
  return (
    <section id="geschmaecker" className="relative scroll-mt-24 py-24">
      <div className="mb-12 px-6 sm:px-10">
        <h2 className="font-display max-w-xl text-3xl sm:text-4xl">
          Alle 50 Geschmäcker, nach Kategorie
        </h2>
        <p className="mt-3 max-w-md font-sans text-sm text-fg-muted">
          Zieh eine Reihe zur Seite oder nutze die Pfeile. Jeder Geschmack
          gibt es als Einweg-Vape und als E-Liquid.
        </p>
      </div>

      {categories.map((c) => (
        <CategoryRow key={c.id} categoryId={c.id} label={c.label} />
      ))}
    </section>
  );
}
