"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Desktop pointer details (fine pointer, motion allowed only):
 * - a thin ring trails the pointer; it widens over links and buttons, and over media marked
 *   [data-cursor="view"] it becomes a filled disc with that word (the native
 *   cursor is hidden there only; everywhere else it stays as usual);
 * - .magnetic elements lean a little towards the pointer.
 */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    const el = ring.current;
    if (!fine.matches || !el) return;
    const label = el.querySelector("span")!;
    let x = -100, y = -100, cx = x, cy = y, raf = 0;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      el.classList.add("on");
      const t = e.target as Element;
      const media = t.closest<HTMLElement>("[data-cursor]");
      el.dataset.mode = media ? "label" : t.closest("a, button, [role=button], summary, label") ? "link" : "";
      if (media) label.textContent = media.dataset.cursor!.toUpperCase();
    };
    const onLeave = () => el.classList.remove("on");
    const tick = () => {
      cx += (x - cx) * 0.18;
      cy += (y - cy) * 0.18;
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // magnetic: lean towards the pointer by a quarter of its offset from the centre
    const mags = [...document.querySelectorAll<HTMLElement>(".magnetic")];
    const pull = (e: PointerEvent) => {
      const m = e.currentTarget as HTMLElement;
      const r = m.getBoundingClientRect();
      m.style.translate = `${((e.clientX - r.left - r.width / 2) * 0.25).toFixed(1)}px ${((e.clientY - r.top - r.height / 2) * 0.3).toFixed(1)}px`;
    };
    const release = (e: PointerEvent) => ((e.currentTarget as HTMLElement).style.translate = "");
    mags.forEach((m) => {
      m.addEventListener("pointermove", pull);
      m.addEventListener("pointerleave", release);
    });

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.documentElement.classList.add("has-cursor");
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("has-cursor");
      mags.forEach((m) => {
        m.removeEventListener("pointermove", pull);
        m.removeEventListener("pointerleave", release);
        m.style.translate = "";
      });
    };
  }, [pathname]);

  return (
    <div ref={ring} className="cursor" aria-hidden="true">
      <span />
    </div>
  );
}
