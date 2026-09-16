"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

const STORAGE_KEY = "nebl-vape-age-verified";

interface AgeGateContextValue {
  verified: boolean;
  confirm: () => void;
  decline: () => void;
}

const AgeGateContext = createContext<AgeGateContextValue | undefined>(undefined);

export function AgeGateProvider({ children }: { children: ReactNode }) {
  const [verified, setVerified] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    try {
      setVerified(window.localStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      // ignore
    }
    setChecked(true);
  }, []);

  const confirm = () => {
    setVerified(true);
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore write failures
    }
  };

  const decline = () => {
    window.location.href = "https://www.bzga.de/";
  };

  return (
    <AgeGateContext.Provider value={{ verified: checked && verified, confirm, decline }}>
      {children}
      {checked && !verified && <AgeGateModal onConfirm={confirm} onDecline={decline} />}
    </AgeGateContext.Provider>
  );
}

export function useAgeGate() {
  const ctx = useContext(AgeGateContext);
  if (!ctx) throw new Error("useAgeGate must be used within an AgeGateProvider");
  return ctx;
}

function AgeGateModal({
  onConfirm,
  onDecline,
}: {
  onConfirm: () => void;
  onDecline: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-bg/95 p-6 backdrop-blur-xl">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-bg-elevated p-8 text-center">
        <div className="mx-auto mb-6 h-10 w-10 rounded-full border border-accent/40" />
        <h2 className="font-display text-2xl text-fg">Bist du volljährig?</h2>
        <p className="mt-3 font-sans text-sm leading-relaxed text-fg-muted">
          Diese Seite enthält Produkte mit Nikotin. Der Zugang und Verkauf ist
          ausschließlich Personen ab 18 Jahren gestattet.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className="h-12 rounded-full bg-accent font-sans text-sm font-medium text-bg transition-opacity hover:opacity-90"
          >
            Ich bin 18 Jahre oder älter
          </button>
          <button
            onClick={onDecline}
            className="h-12 rounded-full border border-line font-sans text-sm text-fg-muted transition-colors hover:border-fg/30 hover:text-fg"
          >
            Ich bin unter 18
          </button>
        </div>
        <p className="mt-6 font-mono text-[10px] uppercase tracking-widest text-fg-muted/70">
          Nikotin erzeugt eine hohe Abhängigkeit
        </p>
      </div>
    </div>
  );
}
