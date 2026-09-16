"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useInView } from "@/lib/useInView";

const VapeCanvasScene = dynamic(() => import("./vape/VapeCanvasScene"), {
  ssr: false,
});

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const stageInView = useInView(stageRef);
  const [lite, setLite] = useState(false);
  const [noWebgl, setNoWebgl] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [forceShow, setForceShow] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Brave/other privacy-hardened browsers make WebGL context creation
    // fail on purpose — feature-detect for real rather than assuming.
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
    const ctx = gsap.context(() => {
      gsap.set(".hero-line span", { yPercent: 110 });
      gsap
        .timeline({ delay: 0.15 })
        .to(".hero-line span", {
          yPercent: 0,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.07,
        })
        .from(
          ".hero-sub, .hero-meta, .hero-cta",
          { opacity: 0, y: 16, duration: 0.8, stagger: 0.08, ease: "power3.out" },
          "-=0.65"
        )
        .from(
          ".hero-stage",
          { opacity: 0, scale: 0.94, duration: 1.1, ease: "power3.out" },
          "-=0.9"
        );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!enable3d || !heroRef.current) return;
    const trigger = ScrollTrigger.create({
      trigger: heroRef.current,
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        progressRef.current = self.progress;
      },
    });
    return () => trigger.kill();
  }, [enable3d]);

  return (
    <div ref={heroRef} className="relative overflow-x-hidden">
      <section className="relative min-h-[92vh] px-6 pb-16 pt-28 sm:px-10 sm:pt-36 lg:min-h-screen">
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-4">
          <div className="max-w-xl">
            <div className="hero-meta mb-6 flex items-center gap-3 font-sans text-sm text-fg-muted">
              <span className="h-1.5 w-1.5 shrink-0 animate-pulse-dot rounded-full bg-accent" />
              50 Aromen, zwei Formate — Einweg-Vape oder E-Liquid
            </div>

            <h1 className="font-display relative text-5xl font-medium leading-[0.98] tracking-tight sm:text-6xl xl:text-7xl">
              <span className="hero-line block overflow-hidden">
                <span className="inline-block">Dein Geschmack</span>
              </span>
              <span className="hero-line block overflow-hidden">
                <span className="inline-block">beginnt im Nebel.</span>
              </span>
            </h1>

            <p className="hero-sub relative mt-8 max-w-md font-sans text-base leading-relaxed text-fg-muted">
              Fünfzig Aromen, jedes einzeln abgestimmt — von Arctic Mint bis
              Clove Ember. Als Einweg-Vape griffbereit oder als E-Liquid zum
              Nachfüllen, in deiner Nikotinstärke.
            </p>

            <div className="hero-cta relative mt-10 flex flex-col items-start gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12 rounded-full px-7 text-base">
                <Link href="#geschmaecker">Geschmäcker entdecken</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="h-12 rounded-full px-7 text-base"
              >
                <Link href="/disclaimer">Sicherheitshinweise</Link>
              </Button>
            </div>
          </div>

          <div
            ref={stageRef}
            className="hero-stage relative h-[52vh] w-full sm:h-[60vh] lg:h-[78vh]"
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-1/2 top-1/2 h-[55%] w-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(111,227,255,0.09),transparent_65%)] blur-2xl" />
              <div className="absolute left-1/2 top-1/2 h-[40%] w-[40%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(160,123,255,0.08),transparent_65%)] blur-2xl" />
            </div>

            {enable3d ? (
              stageInView && <VapeCanvasScene progressRef={progressRef} lite={lite} />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-3xl border border-line bg-bg-elevated/40 px-8 text-center">
                <p className="font-sans text-sm text-fg-muted">
                  {noWebgl
                    ? "Die animierte 3D-Ansicht ist in diesem Browser deaktiviert — meist blockiert ein Privatsphäre-/Fingerprinting-Schutz WebGL."
                    : "Deine Systemeinstellungen bevorzugen reduzierte Bewegung — das animierte 3D-Modell bleibt deshalb standardmäßig aus."}
                </p>
                {!noWebgl && prefersReducedMotion && (
                  <button
                    onClick={() => setForceShow(true)}
                    className="rounded-full border border-line px-5 py-2.5 font-sans text-sm transition-colors hover:border-accent hover:text-accent"
                  >
                    Trotzdem anzeigen
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
