"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import Background from "./components/Background";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default function HomePage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const playBtnRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* =============================
     PAGE + HERO
  ============================== */
  useEffect(() => {
    window.scrollTo(0, 0);

    let smoother: ScrollSmoother | null = null;

    if (!isMobile) {
      smoother = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1.4,
        effects: true,
      });
    }

    gsap.set(".hero-char", {
      x: 0,
      rotation: 0,
      opacity: 1,
      filter: isMobile ? "none" : "blur(0px)",
    });

    ScrollTrigger.create({
      trigger: ".hero",
      start: "top top",
      end: isMobile ? "+=60%" : "+=110%",
      pin: true,
      pinSpacing: true,
    });

    gsap.to(".hero-char", {
      x: (i: number) => {
        const dir = i < 4 ? -1 : 1;
        return dir * (isMobile ? 60 : gsap.utils.random(120, 220));
      },
      rotation: isMobile ? 0 : () => gsap.utils.random(-25, 25),
      opacity: 0.15,
      filter: isMobile ? "none" : "blur(2px)",
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top+=80 top",
        end: "bottom top",
        scrub: true,
      },
    });

    if (!isMobile && !prefersReducedMotion) {
      gsap.to(".hero-char", {
        y: () => gsap.utils.random(-6, 6),
        rotation: () => gsap.utils.random(-1.5, 1.5),
        duration: () => gsap.utils.random(3, 6),
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.15, from: "random" },
      });
    }

    /* ===== Cursor tracking ===== */
    if (!isMobile) {
      const cursor = document.querySelector(".custom-cursor") as HTMLDivElement;
      const glow = document.querySelector(".mouse-glow") as HTMLDivElement;

      gsap.set([cursor, glow], {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      });

      const moveCursor = (e: MouseEvent) => {
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
          overwrite: "auto",
        });
      };

      window.addEventListener("mousemove", moveCursor);

      return () => {
        smoother?.kill();
        window.removeEventListener("mousemove", moveCursor);
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    }

    return () => {
      smoother?.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  /* =============================
     MAGNETIC CURSOR → PLAY BUTTON
  ============================== */
  useEffect(() => {
    if (isMobile || prefersReducedMotion) return;

    const cursor = document.querySelector(".custom-cursor") as HTMLDivElement;
    const btn = playBtnRef.current;
    if (!cursor || !btn) return;

    const radius = 120;

    const onMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const distance = Math.hypot(cx - e.clientX, cy - e.clientY);

      if (distance < radius) {
        gsap.to(cursor, {
          x: cx,
          y: cy,
          duration: 0.25,
          ease: "power3.out",
        });

        gsap.to(btn, {
          scale: 1.08,
          backgroundColor: "var(--red)",
          color: "#ffffff",
          borderColor: "var(--red)",
          duration: 0.25,
          ease: "power3.out",
        });
      } else {
        gsap.to(btn, {
          scale: 1,
          backgroundColor: "transparent",
          color: "var(--red)",
          borderColor: "var(--red)",
          duration: 0.35,
          ease: "power3.out",
        });
      }
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  /* =============================
     VIDEO CONTROLS
  ============================== */
  const togglePlay = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const onTimeUpdate = () => {
    if (!videoRef.current) return;
    setProgress(
      (videoRef.current.currentTime / videoRef.current.duration) * 100
    );
  };

  const seek = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    e.stopPropagation();
    if (!videoRef.current || !progressRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const clientX =
      "touches" in e ? e.touches[0].clientX : e.clientX;

    const percent = (clientX - rect.left) / rect.width;
    videoRef.current.currentTime =
      Math.max(0, Math.min(1, percent)) *
      videoRef.current.duration;
  };

  return (
    <div id="smooth-wrapper">
      {!isMobile && (
        <>
          <div className="custom-cursor fixed top-0 left-0 z-50 w-3 h-3 rounded-full bg-white pointer-events-none -translate-x-1/2 -translate-y-1/2" />
          <div
            ref={glowRef}
            className="mouse-glow fixed top-0 left-0 z-10 w-[420px] h-[420px] -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full bg-[radial-gradient(circle,rgba(177,18,18,0.35),transparent_70%)] blur-3xl"
          />
        </>
      )}

      <div id="smooth-content">
        <main className="relative bg-black text-white overflow-x-hidden">
          <div ref={bgRef}>
            <Background />
          </div>

          {/* HERO */}
          <section className="hero h-screen flex items-center justify-center">
            <h1 className="flex gap-[3vw] text-[18vw] sm:text-[14vw] md:text-[11vw] font-display tracking-[-0.04em] uppercase text-[var(--red)]">
              {"SLAB FANT".split("").map((c, i) => (
                <span key={i} className="hero-char inline-block">
                  {c === " " ? "\u00A0" : c}
                </span>
              ))}
            </h1>
          </section>

          {/* VIDEO */}
          <section className="min-h-[75vh] flex flex-col items-center justify-center gap-8 px-6">
            <div
              className="video-wrap relative w-full max-w-4xl aspect-video rounded-xl overflow-hidden border border-neutral-800"
              onClick={togglePlay}
            >
              <video
                ref={videoRef}
                src="https://cdn.jumpshare.com/preview/ymPfD-zpt--4jnCWYN6AlZS2HSDo1WsS0WaqXJcqAfFltiID5xOJjyPtZS5uB9tubL_Z2xZfeLtHxkCeAw2NJSjmULq-VNMDVs-yurPTD6otcWiJwhB4qYrtjxyhsFFJb9DIXdEYZ-3RDEgeZ66L7m6yjbN-I2pg_cnoHs_AmgI.mp4"
                poster="/song-thumb.jpg"
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
                onTimeUpdate={onTimeUpdate}
              />

              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    ref={playBtnRef}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-[var(--red)] text-[var(--red)] text-2xl md:text-3xl flex items-center justify-center transition-colors"
                  >
                    ▶
                  </div>
                </div>
              )}

              <div
                ref={progressRef}
                onClick={seek}
                onTouchStart={seek}
                className="absolute bottom-0 left-0 w-full h-3 md:h-2 bg-neutral-900"
              >
                <div
                  className="h-full bg-[var(--red)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* WATCH ON YOUTUBE */}
            <a
              href="https://www.youtube.com/watch?v=whCO5s2hzaE"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border border-[var(--red)] text-[var(--red)] uppercase tracking-widest text-xs transition hover:bg-[var(--red)] hover:text-black"
            >
              Glej na YouTubu
            </a>
          </section>

          <footer className="py-10 text-center text-neutral-600 text-sm">
            © {new Date().getFullYear()} Slab Fant
          </footer>
        </main>
      </div>
    </div>
  );
}
