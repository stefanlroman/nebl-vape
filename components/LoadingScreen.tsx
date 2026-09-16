"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Logo from "./Logo";

const MIN_VISIBLE_MS = 700;
const MAX_WAIT_MS = 4000;

// A short, deterministic reveal (no hero video to wait on here) so the
// vapor-trail cursor and 3D canvas never mount mid-layout-shift.
export default function LoadingScreen() {
  const [progress, setProgress] = useState(8);
  const [mounted, setMounted] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const finishedRef = useRef(false);

  useEffect(() => {
    const startedAt = Date.now();
    document.documentElement.style.overflow = "hidden";

    const finish = () => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      setProgress(100);
      gsap.to(rootRef.current, {
        opacity: 0,
        duration: 0.6,
        delay: 0.15,
        ease: "power2.out",
        onComplete: () => {
          document.documentElement.style.overflow = "";
          setMounted(false);
        },
      });
    };

    const trickle = setInterval(() => {
      setProgress((p) => (p < 92 ? p + (92 - p) * 0.12 : p));
    }, 120);

    const minTimer = setTimeout(finish, MIN_VISIBLE_MS);
    const maxTimer = setTimeout(finish, MAX_WAIT_MS);
    void startedAt;

    return () => {
      clearInterval(trickle);
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-bg"
    >
      <div className="flex items-center gap-3">
        <Logo className="h-6 w-6 text-accent" />
        <span className="font-display text-lg tracking-tight">NEBL</span>
      </div>
      <div className="h-px w-48 overflow-hidden bg-line">
        <div
          className="h-full bg-accent transition-[width] duration-300 ease-out"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <span className="font-mono text-[11px] tabular-nums text-fg-muted">
        {Math.min(Math.round(progress), 100)}%
      </span>
    </div>
  );
}
