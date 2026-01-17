"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    gsap.fromTo(
      containerRef.current.children,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.15,
      }
    );
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div
        ref={containerRef}
        className="max-w-3xl text-center space-y-10"
      >
        <h1 className="font-display text-[clamp(3rem,8vw,6rem)] tracking-tight text-[var(--red)]">
          Slab Fant
        </h1>

        <p className="text-neutral-300 text-lg leading-relaxed">
          Slab Fant is a Slovenian music project focused on atmosphere,
          texture, and emotional weight. The sound lives between silence
          and impact — minimal structures, heavy tones, and space that
          breathes.
        </p>

        <p className="text-neutral-400 text-base leading-relaxed">
          Inspired by film scores, industrial sound design, and raw
          electronic movement, Slab Fant explores contrast: tension and
          release, noise and restraint, light and shadow.
        </p>

        <p className="text-neutral-500 text-sm uppercase tracking-widest">
          Sound · Texture · Motion
        </p>
      </div>
    </main>
  );
}
