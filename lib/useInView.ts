"use client";

import { useEffect, useState, type RefObject } from "react";

// Mounts (and, crucially, unmounts) whatever depends on this only while
// the element is near the viewport. Two simultaneously-live WebGL canvases
// (each running its own EffectComposer) is enough to exhaust the GPU
// context budget in some sandboxed browsers and black out the whole page —
// so heavy 3D sections must fully unmount once scrolled well out of view,
// not just hide.
export function useInView<T extends HTMLElement>(
  ref: RefObject<T | null>,
  rootMargin = "400px"
) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return inView;
}
