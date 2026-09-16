export const metadata = { title: "Warnhinweise — NEBL" };

export default function DisclaimerPage() {
  return (
    <div className="px-6 pb-24 pt-32 sm:px-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-4xl">Warnhinweise</h1>

        <div className="mt-8 flex flex-col gap-6 font-sans text-sm leading-relaxed text-fg-muted">
          <p>
            Alle auf dieser Website angebotenen Produkte enthalten Nikotin
            oder sind für die Verwendung mit nikotinhaltigen Liquids
            vorgesehen. <strong className="text-fg">Nikotin erzeugt eine hohe Abhängigkeit</strong> und
            kann bei Nichtrauchern zu einer Nikotinsucht führen.
          </p>
          <p>
            Der Verkauf erfolgt{" "}
            <strong className="text-fg">ausschließlich an Personen ab 18 Jahren</strong>. Mit
            dem Kauf bestätigst du deine Volljährigkeit und dass die
            Produkte weder an Minderjährige weitergegeben noch in deren
            Nähe verwendet werden.
          </p>
          <p>
            Die Produkte sind{" "}
            <strong className="text-fg">
              nicht für Schwangere, Stillende, Nichtraucher oder Personen mit
              Herz-Kreislauf-Erkrankungen
            </strong>{" "}
            geeignet. Bei gesundheitlichen Vorerkrankungen empfehlen wir, vor
            der Verwendung ärztlichen Rat einzuholen.
          </p>
          <p>
            E-Liquids und Einweg-Vapes außerhalb der Reichweite von Kindern
            und Haustieren aufbewahren. Bei Kontakt mit Haut oder Augen
            gründlich mit Wasser spülen; bei Verschlucken umgehend einen Arzt
            oder die Giftnotrufzentrale kontaktieren.
          </p>
          <p>
            Die auf den Produktseiten beschriebenen Aromen und
            Intensitätsangaben dienen der Orientierung beim Einkauf und
            stellen keine gesundheitsbezogene Werbeaussage dar.
          </p>
        </div>
      </div>
    </div>
  );
}
