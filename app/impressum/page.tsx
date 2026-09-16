export const metadata = { title: "Impressum — NEBL" };

export default function ImpressumPage() {
  return (
    <div className="px-6 pb-24 pt-32 sm:px-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-4xl">Impressum</h1>
        <p className="mt-6 rounded-xl border border-accent-dim/40 bg-bg-elevated/40 p-5 font-mono text-xs leading-relaxed text-fg-muted">
          Platzhalter-Seite. Bitte ersetze die folgenden Angaben durch deine
          tatsächlichen Unternehmensdaten gemäß § 5 TMG / § 18 MStV sowie die
          für den Nikotinhandel geltende Gewerbeanmeldung, bevor die Seite
          live geht.
        </p>

        <div className="mt-8 flex flex-col gap-4 font-sans text-sm text-fg-muted">
          <p>
            [Firmenname]
            <br />
            [Straße und Hausnummer]
            <br />
            [PLZ und Ort]
            <br />
            [Land]
          </p>
          <p>
            Vertreten durch: [Name des/der Geschäftsführenden]
            <br />
            E-Mail: [kontakt@deine-domain.de]
            <br />
            Telefon: [Telefonnummer]
          </p>
          <p>
            Handelsregister: [Registergericht, HRB-Nummer]
            <br />
            USt-IdNr.: [DE...]
          </p>
        </div>
      </div>
    </div>
  );
}
