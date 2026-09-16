"use client";

import { useEffect, useRef } from "react";

const TRAIL_LENGTH = 6;
const LAG = 0.22;

// A short chain of blurred dots chasing the pointer, each one lagging the
// one before it — reads as a thin wisp of vapor following the cursor
// across the whole site, not just inside the hero canvas. Pure rAF +
// direct style writes, no React state, so it never triggers a re-render.
export default function VaporCursorTrail() {
  const dotsRef = useRef<(HTMLDivElement | null)[]>([]);
  const pointer = useRef({ x: -100, y: -100 });
  const positions = useRef(
    Array.from({ length: TRAIL_LENGTH }, () => ({ x: -100, y: -100 }))
  );
  const active = useRef(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (reduceMotion || isCoarsePointer) return;

    const onMove = (e: PointerEvent) => {
      pointer.current.x = e.clientX;
      pointer.current.y = e.clientY;
      active.current = true;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    const tick = () => {
      const pos = positions.current;
      pos[0].x += (pointer.current.x - pos[0].x) * LAG;
      pos[0].y += (pointer.current.y - pos[0].y) * LAG;
      for (let i = 1; i < TRAIL_LENGTH; i++) {
        pos[i].x += (pos[i - 1].x - pos[i].x) * LAG;
        pos[i].y += (pos[i - 1].y - pos[i].y) * LAG;
      }
      dotsRef.current.forEach((el, i) => {
        if (!el) return;
        const scale = 1 - i / TRAIL_LENGTH;
        const opacity = active.current ? (1 - i / TRAIL_LENGTH) * 0.7 : 0;
        el.style.transform = `translate3d(${pos[i].x - 13}px, ${pos[i].y - 13}px, 0) scale(${0.5 + scale * 0.7})`;
        el.style.opacity = String(opacity);
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {Array.from({ length: TRAIL_LENGTH }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            dotsRef.current[i] = el;
          }}
          className="vapor-trail-dot"
          style={{ opacity: 0 }}
        />
      ))}
    </>
  );
}
