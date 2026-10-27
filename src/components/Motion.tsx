"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/**
 * Page-wide motion: Lenis smooth scrolling, and fade-in of every `.rv` / `.rv-img` element.
 * Elements already on screen show at once, others as they scroll in, and a safety timer
 * reveals everything, so content can never stay hidden (the problem with earlier samples).
 *
 * Scroll-linked effects only set CSS variables / `translate`, whose defaults show the
 * finished state, so a paused frame loop never hides anything:
 *   --hp on [data-hero]    0 → 1 as the hero scrolls away (media grows, text drifts up)
 *   --wp on [data-window]  0 → 1 as the window section opens to full screen
 *   --lp on [data-lights]  0 → 1 as the dome "switches on" (home)
 *   .frame img             slow parallax
 */
export function Motion() {
  const pathname = usePathname();
  const firstPage = useRef(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true, anchors: true });

    const scrollEffects = () => {
      const vh = window.innerHeight;
      document.querySelectorAll<HTMLElement>("[data-hero]").forEach((el) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--hp", clamp01(-r.top / r.height).toFixed(4));
      });
      document.querySelectorAll<HTMLElement>("[data-window]").forEach((el) => {
        const r = el.getBoundingClientRect();
        // opens over the first 70% of the travel, then holds while the text reads
        el.style.setProperty("--wp", clamp01(-r.top / ((r.height - vh) * 0.7)).toFixed(4));
      });
      document.querySelectorAll<HTMLElement>("[data-lights]").forEach((el) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--lp", clamp01(-r.top / ((r.height - vh) * 0.8)).toFixed(4));
      });
      // Statement words light up one by one as they pass 62% of the screen height.
      document.querySelectorAll<HTMLElement>(".lw").forEach((w) => {
        w.classList.toggle("lit", w.getBoundingClientRect().top < vh * 0.62);
      });
      // Floating photos drift at their own speed (data-speed: fraction of the scroll).
      document.querySelectorAll<HTMLElement>("[data-speed]").forEach((el) => {
        const r = el.parentElement!.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        // Small, capped drift so a photo never leaves its own section.
        const shift = Math.max(-90, Math.min(90, (r.top + r.height / 2 - vh / 2) * -Number(el.dataset.speed)));
        el.style.translate = `0 ${shift.toFixed(1)}px`;
      });
      document.querySelectorAll<HTMLImageElement>(".frame img").forEach((img) => {
        const r = img.parentElement!.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const p = (r.top + r.height / 2 - vh / 2) / vh; // -1 … 1 across the screen
        img.style.translate = `0 ${(p * -6).toFixed(2)}%`;
      });
    };

    let id = requestAnimationFrame(function tick(t) {
      lenis.raf(t);
      scrollEffects();
      id = requestAnimationFrame(tick);
    });

    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>(".rv, .rv-img")].filter((el) => !el.classList.contains("in"));
    const show = (el: HTMLElement) => el.classList.add("in");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            show(e.target as HTMLElement);
            io.unobserve(e.target);
          }
        }),
      { threshold: 0, rootMargin: "0px 0px -8% 0px" },
    );
    const timers: number[] = [];
    els.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) timers.push(window.setTimeout(() => show(el), 80));
      else io.observe(el);
    });
    timers.push(window.setTimeout(() => els.forEach(show), 4000));
    // After the first-visit logo intro, later page changes reveal without its extra delay.
    timers.push(window.setTimeout(() => document.documentElement.classList.add("intro-seen"), 3900));
    document.querySelector("main")?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 900, easing: "cubic-bezier(.2,.7,.1,1)" });
    // Between pages (not on first load, where the logo intro plays): a thin gold line sweeps across.
    if (!firstPage.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const sweep = document.querySelector(".page-sweep") ?? document.body.appendChild(Object.assign(document.createElement("div"), { className: "page-sweep" }));
      sweep.animate(
        [
          { transform: "scaleX(0)", transformOrigin: "left", opacity: 1 },
          { transform: "scaleX(1)", transformOrigin: "left", opacity: 1, offset: 0.55 },
          { transform: "scaleX(1)", transformOrigin: "right", opacity: 0 },
        ],
        { duration: 1200, easing: "cubic-bezier(.2,.7,.1,1)" },
      );
    }
    firstPage.current = false;
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [pathname]);

  return null;
}
