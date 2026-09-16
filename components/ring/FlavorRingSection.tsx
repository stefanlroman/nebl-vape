"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ringFlavors, categoryColors } from "@/lib/flavors";
import { useInView } from "@/lib/useInView";

const FlavorRingCanvas = dynamic(() => import("./FlavorRingCanvas"), { ssr: false });

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function FlavorRingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const stageInView = useInView(stageRef);
  const [lite, setLite] = useState(false);
  const [noWebgl, setNoWebgl] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [forceShow, setForceShow] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let hasWebgl = false;
    try {
      const probe = document.createElement("canvas");
      hasWebgl = !!(probe.getContext("webgl2") || probe.getContext("webgl"));
    } catch {
      hasWebgl = false;
    }
    setPrefersReducedMotion(reduceMotion);
    setNoWebgl(!hasWebgl);
    setLite(window.innerWidth < 768);
  }, []);

  const enable3d = !noWebgl && (!prefersReducedMotion || forceShow);

  useEffect(() => {
    if (!enable3d || !sectionRef.current) return;
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        progressRef.current = self.progress;
      },
    });
    return () => trigger.kill();
  }, [enable3d]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <div className="max-w-xl">
          <h2 className="font-display text-3xl sm:text-4xl">
            Die Bestseller, einmal im Kreis.
          </h2>
          <p className="mt-4 font-sans text-sm leading-relaxed text-fg-muted">
            Ein Querschnitt durch alle sechs Kategorien. Scroll durch die
            Sektion, um den Ring in Schwung zu bringen — oder tippe direkt
            einen Namen an.
          </p>
        </div>
      </div>

      <div ref={stageRef} className="relative mt-10 h-[66vh] w-full sm:h-[74vh]">
        {enable3d ? (
          stageInView && <FlavorRingCanvas progressRef={progressRef} lite={lite} />
        ) : (
          <div className="mx-auto flex h-full max-w-4xl flex-wrap items-center justify-center gap-3 px-6">
            {ringFlavors.map((f) => (
              <Link
                key={f.slug}
                href={`/geschmack/${f.slug}`}
                className="tile-border rounded-full bg-bg-elevated/40 px-4 py-2 font-sans text-sm transition-colors hover:bg-bg-elevated"
                style={{ color: categoryColors[f.category] }}
              >
                {f.name}
              </Link>
            ))}
            {!noWebgl && prefersReducedMotion && (
              <button
                onClick={() => setForceShow(true)}
                className="rounded-full border border-line px-5 py-2.5 font-sans text-sm text-fg-muted transition-colors hover:border-accent hover:text-accent"
              >
                3D-Ring trotzdem anzeigen
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
