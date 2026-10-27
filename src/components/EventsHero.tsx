"use client";

/* eslint-disable @next/next/no-img-element -- local photos, sized by CSS */
import { useEffect, useState } from "react";
import { responsive } from "@/lib/img";

const AUTO_MS = 6000;

/**
 * Events page header: a full-screen slider, one event type per slide with its name large in
 * the middle. Crossfades by itself every few seconds; the arrows move it by hand.
 */
export function EventsHero({ kicker, title, slides, prev, next }: { kicker: string; title: string; slides: { title: string; en: string; image: string }[]; prev: string; next: string }) {
  const n = slides.length;
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => setI((v) => (v + 1) % n), AUTO_MS);
    return () => clearTimeout(id);
  }, [i, n]);

  return (
    <section className="ev-hero" aria-roledescription="carousel">
      {slides.map((s, k) => (
        <div key={s.image} className={`ev-hero-slide${k === i ? " on" : ""}`} aria-hidden={k !== i}>
          <img {...responsive(s.image)} alt="" loading={k === 0 ? "eager" : "lazy"} />
        </div>
      ))}
      <div className="ev-hero-veil" />
      <div className="ev-hero-text">
        <h1 className="kicker kicker-center">{kicker === title ? title : `${kicker} — ${title}`}</h1>
        <div className="ev-hero-names" aria-live="polite">
          {slides.map((s, k) => (
            <p key={s.image} className={`display ev-hero-name${k === i ? " on" : ""}`} aria-hidden={k !== i}>
              <span className="caption">{s.en}</span>
              {s.title}
            </p>
          ))}
        </div>
      </div>
      <button type="button" className="pc-arrow ev-hero-prev" aria-label={prev} onClick={() => setI((i - 1 + n) % n)} />
      <button type="button" className="pc-arrow ev-hero-next" aria-label={next} onClick={() => setI((i + 1) % n)} />
      <p className="ev-hero-count caption" aria-hidden="true">{String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</p>
    </section>
  );
}
