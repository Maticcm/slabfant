"use client";

import { useEffect } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    if (isMobile) return;

    const cursor = document.querySelector(".custom-cursor") as HTMLDivElement;
    const glow = document.querySelector(".mouse-glow") as HTMLDivElement;

    if (!cursor || !glow) return;

    gsap.set([cursor, glow], {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });

    const move = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: "power3.out",
      });

      gsap.to(glow, {
        x: e.clientX,
        y: e.clientY,
        duration: 1.2,
        ease: "expo.out",
      });
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []); // ✅ dependency array NEVER changes

  if (typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      <div className="custom-cursor fixed top-0 left-0 z-[9999] w-3 h-3 rounded-full bg-white pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="mouse-glow fixed top-0 left-0 z-[9998] w-[420px] h-[420px] -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full bg-[radial-gradient(circle,rgba(177,18,18,0.35),transparent_70%)] blur-3xl" />
    </>
  );
}
