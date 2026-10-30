"use client";
/* eslint-disable @next/next/no-img-element -- local photos, sized by CSS */

/**
 * A page's first-screen photo, loaded at high priority. A client component on purpose: the page's
 * own HTML still preloads it, but a server-rendered high-priority <img> also puts a preload hint
 * in the route's prefetch data, so every page linking here (logo, enquiry button) would download
 * this photo too.
 */
export function HeroImg(props: { src: string; srcSet?: string; sizes?: string }) {
  return <img {...props} alt="" fetchPriority="high" />;
}
