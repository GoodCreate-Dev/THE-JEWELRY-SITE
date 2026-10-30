"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Home hero, opened like a film. First visit of a session (CSS, .cine-open in home.css, ~4.5s):
 * JEWELRY rises letter by letter on black, lit from inside by the dome's LED lattice, a gold
 * line draws and OSAKA BAY appears, then the word rushes forward through the letters while
 * the night over the bay opens behind it, and the hero settles; the header arrives last.
 * Later pages of the visit get only the short hero entrance.
 *
 * The opening never holds anyone up: scrolling and clicks work from the first frame, and any
 * wheel, touch, key or click skips straight to the finished hero (.cine-skip).
 * Leaving the hero (every screen size): the night pushes in and the word lifts away, driven by
 * Motion.tsx's --hp.
 */
export function HeroCine({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    const open = el?.querySelector<HTMLElement>(".cine-open");
    if (!el || !open || getComputedStyle(open).display === "none") return;
    const events = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
    const off = () => events.forEach((e) => window.removeEventListener(e, skip));
    const skip = () => {
      el.classList.add("cine-skip");
      off();
    };
    events.forEach((e) => window.addEventListener(e, skip, { passive: true }));
    // after the opening there is nothing left to skip
    const t = window.setTimeout(off, 5200);
    return () => {
      clearTimeout(t);
      off();
    };
  }, []);

  return (
    // Motion.tsx may set --hp on it before hydration
    <section ref={root} className="cine" data-hero suppressHydrationWarning>
      {children}
    </section>
  );
}
