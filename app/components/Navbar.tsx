"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
];

export default function Navbar() {
  const navRef = useRef<HTMLDivElement | null>(null);
  const indicatorRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!navRef.current) return;

    const isMobile = window.matchMedia("(pointer: coarse)").matches;

    gsap.fromTo(
      navRef.current,
      { opacity: 0, y: isMobile ? 40 : -40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.3,
      }
    );
  }, []);

  useEffect(() => {
    if (!navRef.current || !indicatorRef.current) return;

    const active = navRef.current.querySelector(
      `a[href="${pathname}"]`
    ) as HTMLElement;

    if (!active) return;

    const rect = active.getBoundingClientRect();
    const parentRect = navRef.current.getBoundingClientRect();

    gsap.to(indicatorRef.current, {
      x: rect.left - parentRect.left,
      width: rect.width,
      duration: 0.45,
      ease: "power3.out",
    });
  }, [pathname]);

  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;

  return (
    <div
      ref={navRef}
      className={`fixed left-1/2 -translate-x-1/2 z-50
        ${isMobile ? "bottom-6" : "top-6"}
      `}
    >
      <nav className="relative flex items-center gap-1 px-2 py-2 rounded-full bg-black/80 backdrop-blur-xl border border-neutral-800 shadow-xl">
        <div
          ref={indicatorRef}
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[34px] rounded-full bg-[var(--red)] z-0"
          style={{ width: 0 }}
        />

        {navItems.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative z-10 px-5 py-2 text-xs uppercase tracking-widest transition-colors
                ${active ? "text-white" : "text-neutral-400 hover:text-white"}
              `}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
