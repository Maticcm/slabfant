"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Background() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    /* =============================
       MOUSE PARALLAX (SUBTLE)
    ============================== */
    const onMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      gsap.to(grid, {
        x: x * 20,
        y: y * 20,
        duration: 1.6,
        ease: "power3.out",
      });
    };

    window.addEventListener("mousemove", onMouseMove);

    /* =============================
       SCROLL DRIFT
    ============================== */
    gsap.to(grid, {
      yPercent: -10,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Glow Layer */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(177,18,18,0.18),transparent_70%)] blur-3xl" />

      {/* Grid */}
      <div
        ref={gridRef}
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(circle at center, rgba(0,0,0,0.9), transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(circle at center, rgba(0,0,0,0.9), transparent 75%)",
        }}
      />

      {/* Accent Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_60%,rgba(177,18,18,0.12),transparent_60%)]" />
    </div>
  );
}
