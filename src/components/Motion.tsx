"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

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
 *   .frame img             slow parallax
 * On fine pointers it also adds the gold cursor and magnetic buttons.
 */
export function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true, anchors: true });
    const fine = window.matchMedia("(pointer: fine)").matches;

    // gold cursor: a ring that trails the pointer and a dot that follows it exactly
    let ring: HTMLDivElement | null = null;
    let dot: HTMLDivElement | null = null;
    const mouse = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };
    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      const t = e.target as Element;
      ring?.classList.toggle("view", !!t.closest?.(".frame"));
      ring?.classList.toggle("link", !t.closest?.(".frame") && !!t.closest?.("a, button, label, [role=button]"));
      const hide = !!t.closest?.("input, textarea, select, iframe");
      ring?.classList.toggle("hide", hide);
      dot?.classList.toggle("hide", hide);
      // magnetic buttons lean toward the pointer
      const btn = t.closest?.<HTMLElement>(".btn, .head-cta");
      document.querySelectorAll<HTMLElement>(".btn, .head-cta").forEach((b) => {
        if (b !== btn) b.style.translate = "";
      });
      if (btn) {
        const r = btn.getBoundingClientRect();
        btn.style.translate = `${(e.clientX - r.left - r.width / 2) * 0.22}px ${(e.clientY - r.top - r.height / 2) * 0.32}px`;
      }
    };
    const onLeave = () => {
      ring?.classList.add("hide");
      dot?.classList.add("hide");
    };
    if (fine) {
      ring = Object.assign(document.createElement("div"), { className: "cursor hide" });
      dot = Object.assign(document.createElement("div"), { className: "cursor-dot hide" });
      document.body.append(ring, dot);
      document.documentElement.classList.add("has-cursor");
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onLeave);
    }

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
      if (ring && dot) {
        pos.x += (mouse.x - pos.x) * 0.16;
        pos.y += (mouse.y - pos.y) * 0.16;
        ring.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
        dot.style.transform = `translate(${mouse.x}px, ${mouse.y}px)`;
      }
      id = requestAnimationFrame(tick);
    });
    const showOnFirstMove = () => {
      ring?.classList.remove("hide");
      dot?.classList.remove("hide");
    };
    if (fine) window.addEventListener("pointermove", showOnFirstMove, { once: true });

    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointermove", showOnFirstMove);
      document.removeEventListener("pointerleave", onLeave);
      ring?.remove();
      dot?.remove();
      document.documentElement.classList.remove("has-cursor");
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
    timers.push(window.setTimeout(() => document.documentElement.classList.add("intro-seen"), 3200));
    document.querySelector("main")?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 900, easing: "cubic-bezier(.2,.7,.1,1)" });
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [pathname]);

  return null;
}
