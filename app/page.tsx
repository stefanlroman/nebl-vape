import Link from "next/link";
import Hero from "@/components/Hero";
import FlavorWall from "@/components/FlavorWall";
import BestsellerShowcase from "@/components/BestsellerShowcase";
import FlavorCatalog from "@/components/FlavorCatalog";

export default function Home() {
  return (
    <>
      <Hero />
      <FlavorWall />
      <BestsellerShowcase />
      <FlavorCatalog />

      <section className="relative border-t border-line px-6 py-24 sm:px-10">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 rounded-2xl border border-line bg-bg-elevated/40 p-8 sm:flex-row sm:items-center sm:p-12">
          <div>
            <h2 className="font-display max-w-lg text-2xl sm:text-3xl">
              Alle Produkte enthalten Nikotin oder sind für nikotinhaltige Liquids vorgesehen.
            </h2>
            <p className="mt-3 max-w-lg font-sans text-sm text-fg-muted">
              Nikotin erzeugt eine hohe Abhängigkeit. Verkauf ausschließlich
              an Personen ab 18 Jahren.
            </p>
          </div>
          <Link
            href="/disclaimer"
            className="shrink-0 rounded-full border border-line px-6 py-3 font-sans text-sm transition-colors hover:border-accent hover:text-accent"
          >
            Warnhinweise lesen
          </Link>
        </div>
      </section>
    </>
  );
}
