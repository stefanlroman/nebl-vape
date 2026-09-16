"use client";

import { useState } from "react";
import { useCart, type Format } from "@/lib/cart-context";
import { Flavor, formatPrice, nicotineLabel } from "@/lib/flavors";

export default function VariantPicker({ flavor }: { flavor: Flavor }) {
  const { addItem } = useCart();
  const [format, setFormat] = useState<Format>("disposable");
  const [nicotine, setNicotine] = useState(flavor.nicotineLevels[1] ?? flavor.nicotineLevels[0]);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const price = format === "disposable" ? flavor.disposablePrice : flavor.liquidPrice;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <span className="font-sans text-sm text-fg-muted">Format</span>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            onClick={() => setFormat("disposable")}
            className={`rounded-xl border px-4 py-3 text-left font-sans text-sm transition-colors ${
              format === "disposable"
                ? "border-accent bg-accent/10 text-fg"
                : "border-line text-fg-muted hover:border-fg/30"
            }`}
          >
            Einweg-Vape
            <span className="mt-1 block font-mono text-[11px] text-fg-muted">
              {flavor.disposablePuffs} Züge
            </span>
          </button>
          <button
            onClick={() => setFormat("liquid")}
            className={`rounded-xl border px-4 py-3 text-left font-sans text-sm transition-colors ${
              format === "liquid"
                ? "border-accent bg-accent/10 text-fg"
                : "border-line text-fg-muted hover:border-fg/30"
            }`}
          >
            E-Liquid
            <span className="mt-1 block font-mono text-[11px] text-fg-muted">10 ml</span>
          </button>
        </div>
      </div>

      {format === "liquid" && (
        <div>
          <span className="font-sans text-sm text-fg-muted">Nikotinstärke</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {flavor.nicotineLevels.map((mg) => (
              <button
                key={mg}
                onClick={() => setNicotine(mg)}
                className={`rounded-full border px-3.5 py-2 font-mono text-xs transition-colors ${
                  nicotine === mg
                    ? "border-accent bg-accent/10 text-fg"
                    : "border-line text-fg-muted hover:border-fg/30"
                }`}
              >
                {nicotineLabel(mg)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <span className="font-sans text-sm text-fg-muted">Menge</span>
        <div className="flex items-center gap-3 rounded-full border border-line px-3 py-1.5">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="font-mono text-sm text-fg-muted hover:text-fg"
            aria-label="Menge verringern"
          >
            −
          </button>
          <span className="w-4 text-center font-mono text-sm">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(99, q + 1))}
            className="font-mono text-sm text-fg-muted hover:text-fg"
            aria-label="Menge erhöhen"
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={() => {
          addItem(flavor, format, format === "liquid" ? nicotine : undefined, quantity);
          setJustAdded(true);
          setTimeout(() => setJustAdded(false), 1600);
        }}
        className="rounded-full bg-accent px-8 py-3.5 font-sans text-sm font-medium text-bg transition-opacity hover:opacity-90"
      >
        {justAdded ? "Hinzugefügt ✓" : `In den Warenkorb — ${formatPrice(price)}`}
      </button>
    </div>
  );
}
