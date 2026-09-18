"use client";

import { useRef, type PointerEvent } from "react";

// Shared drag-to-scroll + arrow-button behavior for the horizontal flavor
// rows (bestseller showcase, per-category catalog rows). `itemWidth` is the
// card width in px, used to size an arrow-click scroll step.
export function useDragScroll(itemWidth: number) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ startX: number; startScroll: number } | null>(null);

  const scrollBy = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: dir * (itemWidth + 16) * 2, behavior: "smooth" });
  };

  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    const el = scrollerRef.current;
    if (!el) return;
    drag.current = { startX: e.clientX, startScroll: el.scrollLeft };
    el.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: PointerEvent) => {
    if (!drag.current || !scrollerRef.current) return;
    scrollerRef.current.scrollLeft = drag.current.startScroll - (e.clientX - drag.current.startX);
  };
  const endDrag = () => {
    drag.current = null;
  };

  return { scrollerRef, scrollBy, onPointerDown, onPointerMove, endDrag };
}
