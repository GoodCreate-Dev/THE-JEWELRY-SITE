"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Google Maps embed that loads only as it scrolls near the screen: the embed pulls in ~700 KB of
 * Google's scripts, which would otherwise download with the page (phones fetch "lazy" frames
 * from far below the screen).
 */
export function MapEmbed({ src, title }: { src: string; title: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      setShow(true);
      io.disconnect();
    }, { rootMargin: "300px 0px" });
    io.observe(box.current!);
    return () => io.disconnect();
  }, []);

  return <div ref={box} className="access2-map">{show && <iframe title={title} src={src} />}</div>;
}
