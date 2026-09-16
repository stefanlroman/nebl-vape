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

// How much cumulative wheel/touch delta (px) it takes to fully "spin up"
// the vape before the page is allowed to scroll — mirrors the lock feel
// used on the sibling Peptide site's hero.
const ROTATE_DISTANCE = 900;
const TOUCH_ROTATE_DISTANCE = 450;

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const stageInView = useInView(stageRef, "800px");

  // Two independent 0..1 progress sources feed into one combined value the
  // 3D scene reads every frame: lockProgress (scroll-jacked spin-up while
  // pinned at the very top) and scrollProgress (normal scroll once
  // unlocked, driving the continued zoom-in). Refs, not state — read inside
  // useFrame without triggering React re-renders.
  const lockProgressRef = useRef(0);
  const scrollProgressRef = useRef(0);
  const combinedProgressRef = useRef({
    get current() {
      return lockProgressRef.current + scrollProgressRef.current;
    },
  }).current;

  const [lite, setLite] = useState(false);
  const [noWebgl, setNoWebgl] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [forceShow, setForceShow] = useState(false);
  const [locked, setLockedState] = useState(true);

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
          ".hero-sub, .hero-meta, .hero-cta, .hero-hint",
          { opacity: 0, y: 16, duration: 0.8, stagger: 0.08, ease: "power3.out" },
          "-=0.65"
        );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  // Phase A — pin the page at scrollY 0 and translate wheel/touch/keyboard
  // input into lockProgress instead of letting the browser scroll, so the
  // vape visibly "spins up" before the rest of the site becomes reachable.
  useEffect(() => {
    if (!enable3d) return;
    const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
    const setBodyLocked = (next: boolean) => {
      document.body.style.overflow = next ? "hidden" : "";
      setLockedState(next);
    };
    if (window.scrollY <= 0) setBodyLocked(true);

    const advance = (delta: number, distance = ROTATE_DISTANCE) => {
      const atTop = window.scrollY <= 0;
      const alreadyFinished = lockProgressRef.current >= 1;
      if (!atTop || (alreadyFinished && delta > 0)) {
        if (document.body.style.overflow === "hidden") setBodyLocked(false);
        return false;
      }
      setBodyLocked(true);
      lockProgressRef.current = clamp01(lockProgressRef.current + delta / distance);
      if (lockProgressRef.current >= 1 && delta > 0) setBodyLocked(false);
      return true;
    };

    const onWheel = (e: WheelEvent) => {
      if (advance(e.deltaY)) e.preventDefault();
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY;
      const delta = touchStartY - currentY;
      touchStartY = currentY;
      if (advance(delta, TOUCH_ROTATE_DISTANCE)) e.preventDefault();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        if (advance(80)) e.preventDefault();
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        if (advance(-80)) e.preventDefault();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      setBodyLocked(false);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [enable3d]);

  // Phase B — once unlocked, normal page scroll through the hero drives the
  // continued zoom-in/rotation via ordinary ScrollTrigger scrub.
  useEffect(() => {
    if (!enable3d || !heroRef.current) return;
    const trigger = ScrollTrigger.create({
      trigger: heroRef.current,
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        scrollProgressRef.current = self.progress;
      },
    });
    return () => trigger.kill();
  }, [enable3d]);

  return (
    <div ref={heroRef} className="relative overflow-x-hidden">
      <section className="relative min-h-[92vh] overflow-hidden px-6 pb-16 pt-28 sm:px-10 sm:pt-36 lg:min-h-screen">
        <div ref={stageRef} className="absolute inset-0 -z-10">
          {enable3d ? (
            stageInView && (
              <VapeCanvasScene progressRef={combinedProgressRef} lite={lite} />
            )
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-4 px-8 text-center">
              <p className="max-w-sm font-sans text-sm text-fg-muted">
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
          {/* Scrim so the headline stays legible over the vape without the
              canvas needing its own solid backdrop. */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-bg via-bg/55 to-transparent sm:via-bg/35" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
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
        </div>

        {enable3d && (
          <div
            className="hero-hint pointer-events-none absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-fg-muted transition-opacity duration-500"
            style={{ opacity: locked ? 1 : 0 }}
          >
            <span>Scroll, um den Nebel zu wecken</span>
            <span className="h-6 w-px animate-pulse-dot bg-fg-muted/60" />
          </div>
        )}
      </section>
    </div>
  );
}
