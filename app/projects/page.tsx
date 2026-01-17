"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const projects = [
  {
    title: "SLAB FANT",
    year: "2024",
    description:
      "A visual-driven release exploring tension, distortion, and minimal rhythm.",
  },
  {
    title: "UNTITLED SESSIONS",
    year: "2023",
    description:
      "Experimental sketches focused on texture, space, and repetition.",
  },
  {
    title: "LIVE PERFORMANCE",
    year: "2022",
    description:
      "Improvised live set built from layered drones and reactive sound.",
  },
];

export default function ProjectsPage() {
  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    if (!listRef.current) return;

    gsap.fromTo(
      listRef.current.children,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.2,
      }
    );
  }, []);

  return (
    <main className="min-h-screen px-6 py-32">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-[clamp(3rem,7vw,5rem)] tracking-tight text-[var(--red)] mb-16 text-center">
          Projects
        </h1>

        <ul ref={listRef} className="space-y-12">
          {projects.map((project, i) => (
            <li
              key={i}
              className="border-b border-neutral-800 pb-8"
            >
              <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-4">
                <h2 className="font-display text-2xl tracking-tight">
                  {project.title}
                </h2>
                <span className="text-neutral-500 text-sm">
                  {project.year}
                </span>
              </div>

              <p className="mt-4 text-neutral-400 leading-relaxed max-w-2xl">
                {project.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
