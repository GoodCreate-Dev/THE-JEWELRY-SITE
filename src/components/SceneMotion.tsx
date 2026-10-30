"use client";

import { useEffect } from "react";

/**
 * Wraps each character of a heading in its own mask so it can rise. Every character, Japanese or
 * Latin, has its own mask (one mask per Latin word showed half-cut words while rising); Latin
 * words are held together (.swl) so they never break across lines.
 */
function split(el: HTMLElement) {
  if (el.dataset.splitDone) return;
  el.dataset.splitDone = "1";
  el.setAttribute("aria-label", el.textContent ?? "");
  const masked = (c: string) => {
    const w = document.createElement("span");
    w.className = "sw";
    w.setAttribute("aria-hidden", "true");
    const s = document.createElement("span");
    s.className = "sch";
    s.textContent = c;
    w.append(s);
    return w;
  };
  const walk = (node: Node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === Node.ELEMENT_NODE) return walk(n);
      if (n.nodeType !== Node.TEXT_NODE || !n.textContent) return;
      const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach((word) => {
        if (!word) return;
        if (/^\s+$/.test(word)) return frag.append(" ");
        if (/[　-鿿＀-￯]/.test(word)) return [...word].forEach((c) => frag.append(masked(c)));
        const whole = document.createElement("span");
        whole.className = "swl";
        whole.setAttribute("aria-hidden", "true");
        [...word].forEach((c) => whole.append(masked(c)));
        frag.append(whole);
      });
      n.replaceWith(frag);
    });
  };
  walk(el);
}

/**
 * Scroll choreography for the scenes of every page (the home hero has its own, HeroCine); each
 * part only runs where its elements are on the page.
 * GSAP + ScrollTrigger, loaded after render. Everything is visible without it: initial states
 * are only set here, so no script or reduced motion means a plain, readable page.
 *
 * Every screen size:  headings [data-split] rise letter by letter · [data-reveal] rise in
 *                     · band photos open from their side and drift · event cards rise in turn
 *                     · statement characters light up · figures count up · kinetic line
 *                     · 11.01 settles · photos drift
 * Desktop (≥1025px):  the gallery runs sideways (pinned) with a progress line and counter
 */
export function SceneMotion() {
  useEffect(() => {
    let cleanup = () => {};
    let cancelled = false;
    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const $ = <T extends Element = HTMLElement>(q: string) => gsap.utils.toArray<T>(q);
      const one = (q: string) => document.querySelector<HTMLElement>(q);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        $("[data-split]").forEach((el) => {
          split(el);
          gsap.from(el.querySelectorAll(".sch"), {
            yPercent: 115, rotate: 4, duration: 1.3, ease: "expo.out", stagger: 0.028,
            scrollTrigger: { trigger: el, start: "top 86%", once: true },
          });
        });

        $("[data-reveal]").forEach((el) => {
          gsap.from(el, { autoAlpha: 0, y: 36, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } });
        });

        $(".bd").forEach((band) => {
          const rev = band.classList.contains("bd-rev");
          const img = band.querySelector<HTMLElement>(".bd-img")!;
          gsap.fromTo(img, { clipPath: rev ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)" }, {
            clipPath: "inset(0 0% 0 0%)", duration: 1.8, ease: "expo.inOut",
            scrollTrigger: { trigger: band, start: "top 72%", once: true },
          });
          gsap.fromTo(img.querySelector("img"), { scale: 1.25, yPercent: -6 }, {
            scale: 1.04, yPercent: 6, ease: "none",
            scrollTrigger: { trigger: band, start: "top bottom", end: "bottom top", scrub: true },
          });
          gsap.fromTo(band.querySelector(".bd-num"), { yPercent: 40 }, {
            yPercent: -40, ease: "none",
            scrollTrigger: { trigger: band, start: "top bottom", end: "bottom top", scrub: true },
          });
        });

        // quote scenes: the photo opens from a narrow window to full screen as it comes in
        $(".qs").forEach((qs) => {
          gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: qs, start: "top bottom", end: "top 15%", scrub: 0.3 } })
            .fromTo(qs.querySelector(".qs-media"), { clipPath: "inset(18% 26% 18% 26%)" }, { clipPath: "inset(0% 0% 0% 0%)" }, 0)
            .fromTo(qs.querySelector(".qs-media > *"), { scale: 1.3 }, { scale: 1.05 }, 0);
        });

        const cats = $(".cat");
        if (cats.length) {
          gsap.from(cats, {
            clipPath: "inset(100% 0 0 0)", duration: 1.6, ease: "expo.inOut", stagger: 0.12,
            scrollTrigger: { trigger: ".cats", start: "top 80%", once: true },
          });
        }

        const statement = one(".h-statement-text");
        if (statement) {
          gsap.fromTo(statement.querySelectorAll(".sc"), { opacity: 0.14 }, {
            opacity: 1, stagger: 0.05, ease: "none",
            scrollTrigger: { trigger: statement, start: "top 78%", end: "bottom 45%", scrub: true },
          });
        }

        $("[data-count]").forEach((el) => {
          const end = Number(el.dataset.count!.replace(/,/g, ""));
          const n = { v: 0 };
          gsap.to(n, {
            v: end, duration: 2, ease: "power3.out",
            onUpdate: () => {
              el.textContent = Math.round(n.v).toLocaleString("en-US");
            },
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          });
        });

        const kinetic = one(".h-kinetic");
        if (kinetic) {
          gsap.fromTo(kinetic.firstElementChild, { xPercent: 0 }, {
            xPercent: -40, ease: "none",
            scrollTrigger: { trigger: kinetic, start: "top bottom", end: "bottom top", scrub: true },
          });
        }

        const date = one(".h-date-num");
        if (date) {
          gsap.fromTo(date, { scale: 1.35, backgroundPosition: "50% 0%" }, {
            scale: 1, backgroundPosition: "50% 100%", ease: "none",
            scrollTrigger: { trigger: date, start: "top bottom", end: "center 45%", scrub: true },
          });
        }

        // quiet background films: fetched and played only once they come close
        $<HTMLVideoElement>("video[data-lazy-src]").forEach((v) => {
          ScrollTrigger.create({
            trigger: v, start: "top 150%", once: true,
            onEnter: () => {
              v.poster = v.dataset.lazyPoster ?? "";
              v.src = v.dataset.lazySrc!;
              v.play().catch(() => {});
            },
          });
        });

        $(".h-visit-img img, .h-contact-bg").forEach((img) => {
          gsap.fromTo(img, { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
        });
      });

      // reduced motion: the films stay still, their posters arrive once they come close
      mm.add("(prefers-reduced-motion: reduce)", () => {
        $<HTMLVideoElement>("video[data-lazy-poster]").forEach((v) => {
          ScrollTrigger.create({ trigger: v, start: "top 150%", once: true, onEnter: () => void (v.poster = v.dataset.lazyPoster!) });
        });
      });

      mm.add("(min-width: 1025px) and (prefers-reduced-motion: no-preference)", () => {
        const track = one(".h-gallery-track");
        const gallery = one(".h-gallery");
        if (track && gallery) {
          const plates = $(".h-plate");
          const count = gallery.querySelector(".h-gallery-count b");
          const bar = gallery.querySelector<HTMLElement>(".h-gallery-bar i");
          const distance = () => track.scrollWidth - window.innerWidth;
          const run = gsap.to(track, {
            x: () => -distance(), ease: "none",
            scrollTrigger: {
              // measured first: the triggers below it depend on the room its pin adds
              trigger: gallery, start: "top top", end: () => `+=${distance()}`, pin: true, scrub: 0.3, invalidateOnRefresh: true, refreshPriority: 1,
              onUpdate: (st) => {
                if (bar) bar.style.transform = `scaleX(${st.progress.toFixed(3)})`;
                if (count) count.textContent = String(Math.min(plates.length, 1 + Math.floor(st.progress * plates.length))).padStart(2, "0");
              },
            },
          });
          // each photo drifts a little inside its frame as it travels
          $(".h-plate-img img").forEach((img) => {
            gsap.fromTo(img, { xPercent: -6 }, {
              xPercent: 6, ease: "none",
              scrollTrigger: { trigger: img.parentElement, containerAnimation: run, start: "left right", end: "right left", scrub: true },
            });
          });
        }
      });

      // Anything that changes the page height after this point (a late font, photos, a style
      // change) would leave the pinned gallery starting in the wrong place, showing it over the
      // sections above: measure again whenever the page height changes.
      let lastHeight = document.body.offsetHeight;
      let timer = 0;
      const ro = new ResizeObserver(() => {
        const height = document.body.offsetHeight;
        if (height === lastHeight) return;
        lastHeight = height;
        clearTimeout(timer);
        timer = window.setTimeout(() => {
          ScrollTrigger.refresh();
          lastHeight = document.body.offsetHeight;
        }, 150);
      });
      ro.observe(document.body);
      document.fonts?.ready.then(() => !cancelled && ScrollTrigger.refresh());
      cleanup = () => {
        ro.disconnect();
        clearTimeout(timer);
        mm.revert();
      };
    })();
    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return null;
}
