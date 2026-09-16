"use client";

import { useState } from "react";

export default function KontaktPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="px-6 pb-24 pt-32 sm:px-10">
      <div className="mx-auto max-w-xl">
        <h1 className="font-display text-4xl">Sprich mit uns.</h1>
        <p className="mt-4 font-sans text-sm text-fg-muted">
          Fragen zu Geschmäckern, Nikotinstärken oder deiner Bestellung?
          Schreib uns.
        </p>

        {sent ? (
          <p className="mt-10 rounded-xl border border-line bg-bg-elevated/40 p-6 font-sans text-sm">
            Danke — deine Nachricht wurde erfasst (Demo, ohne Versand).
          </p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="mt-10 flex flex-col gap-4"
          >
            <input
              required
              placeholder="Name"
              className="rounded-lg border border-line bg-transparent px-4 py-3 font-sans text-sm outline-none focus:border-accent-dim"
            />
            <input
              required
              type="email"
              placeholder="E-Mail"
              className="rounded-lg border border-line bg-transparent px-4 py-3 font-sans text-sm outline-none focus:border-accent-dim"
            />
            <textarea
              required
              rows={5}
              placeholder="Nachricht"
              className="resize-none rounded-lg border border-line bg-transparent px-4 py-3 font-sans text-sm outline-none focus:border-accent-dim"
            />
            <button
              type="submit"
              className="rounded-full bg-accent py-3.5 font-sans text-sm font-medium text-bg hover:opacity-90"
            >
              Nachricht senden
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
