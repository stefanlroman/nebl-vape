import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-line px-6 py-16 sm:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:justify-between">
        <div className="max-w-sm">
          <p className="flex items-center gap-2 font-display text-xl">
            <Logo className="h-6 w-6 text-accent" />
            NEBL
          </p>
          <p className="mt-3 font-sans text-sm leading-relaxed text-fg-muted">
            50 Geschmäcker, ein Nebel. Einweg-Vapes und E-Liquids für alle,
            die genau wissen, was sie schmecken wollen. Verkauf ausschließlich
            an Personen ab 18 Jahren.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          <div>
            <p className="mb-3 font-sans text-sm font-medium text-fg">Shop</p>
            <ul className="flex flex-col gap-2 font-sans text-sm text-fg-muted">
              <li>
                <Link href="/#geschmaecker" className="hover:text-accent">
                  Geschmäcker
                </Link>
              </li>
              <li>
                <Link href="/warenkorb" className="hover:text-accent">
                  Warenkorb
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="hover:text-accent">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-3 font-sans text-sm font-medium text-fg">
              Rechtliches
            </p>
            <ul className="flex flex-col gap-2 font-sans text-sm text-fg-muted">
              <li>
                <Link href="/disclaimer" className="hover:text-accent">
                  Warnhinweise
                </Link>
              </li>
              <li>
                <Link href="/widerruf" className="hover:text-accent">
                  Widerrufsrecht
                </Link>
              </li>
              <li>
                <Link href="/impressum" className="hover:text-accent">
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="hover:text-accent">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link href="/agb" className="hover:text-accent">
                  AGB
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <p className="mx-auto mt-14 max-w-6xl font-sans text-xs text-fg-muted">
        © {new Date().getFullYear()} NEBL — Produkte enthalten Nikotin. Nikotin
        erzeugt eine hohe Abhängigkeit. Verkauf nur an Personen ab 18 Jahren.
      </p>
    </footer>
  );
}
