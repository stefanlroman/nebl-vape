"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import Logo from "./Logo";

export default function Header() {
  const { totalCount, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-30 flex justify-center px-4 pt-4 sm:pt-6">
      <div className="capsule flex w-full max-w-3xl items-center justify-between gap-2 px-3 py-2 sm:px-5">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-sm font-medium tracking-tight sm:text-base"
        >
          <Logo className="h-5 w-5 text-accent sm:h-6 sm:w-6" />
          NEBL
        </Link>

        <nav className="hidden items-center gap-6 font-mono text-[11px] text-fg-muted sm:flex">
          <Link href="/#geschmaecker" className="transition-colors hover:text-fg">
            Geschmäcker
          </Link>
          <Link href="/disclaimer" className="transition-colors hover:text-fg">
            Warnhinweise
          </Link>
          <Link href="/kontakt" className="transition-colors hover:text-fg">
            Kontakt
          </Link>
        </nav>

        <div className="flex items-center gap-1">
          <button
            onClick={openCart}
            className="relative flex items-center gap-2 rounded-full border border-line px-3 py-1.5 font-sans text-sm text-fg transition-colors hover:border-accent-dim"
            aria-label="Warenkorb öffnen"
          >
            Warenkorb
            {totalCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-bg">
                {totalCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="ml-1 flex h-8 w-8 items-center justify-center rounded-full border border-line sm:hidden"
            aria-label="Menü öffnen"
          >
            <span className="font-mono text-xs">{menuOpen ? "×" : "≡"}</span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="capsule absolute top-16 flex w-[calc(100%-2rem)] max-w-3xl flex-col gap-4 p-5 font-mono text-xs sm:hidden">
          <Link href="/#geschmaecker" onClick={() => setMenuOpen(false)}>
            Geschmäcker
          </Link>
          <Link href="/disclaimer" onClick={() => setMenuOpen(false)}>
            Warnhinweise
          </Link>
          <Link href="/kontakt" onClick={() => setMenuOpen(false)}>
            Kontakt
          </Link>
        </div>
      )}
    </header>
  );
}
