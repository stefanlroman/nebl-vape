export const metadata = { title: "Datenschutz — NEBL" };

export default function DatenschutzPage() {
  return (
    <div className="px-6 pb-24 pt-32 sm:px-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-4xl">Datenschutzerklärung</h1>
        <p className="mt-6 rounded-xl border border-accent-dim/40 bg-bg-elevated/40 p-5 font-mono text-xs leading-relaxed text-fg-muted">
          Platzhalter-Seite. Diese Vorlage ersetzt keine rechtliche Beratung.
          Erstelle vor dem Livegang eine vollständige, DSGVO-konforme
          Datenschutzerklärung, die auch die Altersverifikation und deine
          tatsächliche Datenverarbeitung (Hosting, Cookies, Zahlungsanbieter)
          abbildet.
        </p>

        <div className="mt-8 flex flex-col gap-4 font-sans text-sm text-fg-muted">
          <p>
            Diese Website verarbeitet personenbezogene Daten nur im
            erforderlichen Umfang, z. B. bei der Altersverifikation, beim
            Absenden des Kontaktformulars oder im Rahmen einer Bestellung.
            Eine Übermittlung an Dritte erfolgt ausschließlich, soweit dies
            zur Vertragserfüllung notwendig ist.
          </p>
          <p>Verantwortlicher: [Firmenname, Anschrift, Kontakt]</p>
          <p>
            Für Fragen zum Datenschutz wende dich an: [datenschutz@deine-domain.de]
          </p>
        </div>
      </div>
    </div>
  );
}
