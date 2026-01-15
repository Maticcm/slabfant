"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import Background from "./components/Background";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default function HomePage(): JSX.Element {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  /* ===== Audio ===== */
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataRef = useRef<Uint8Array | null>(null);
  const rafRef = useRef<number | null>(null);

  /* =============================
     PAGE + HERO SETUP
  ============================== */
  useEffect(() => {
    window.scrollTo(0, 0);

    const smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.4,
      effects: true,
    });

    gsap.set(".hero-char", {
      x: 0,
      rotation: 0,
      opacity: 1,
      filter: "blur(0px)",
    });

    ScrollTrigger.create({
      trigger: ".hero",
      start: "top top",
      end: "+=110%",
      pin: true,
      pinSpacing: true,
    });

    gsap.to(".hero-char", {
      x: (i: number) => {
        const dir = i < 4 ? -1 : 1;
        return dir * gsap.utils.random(120, 220);
      },
      rotation: () => gsap.utils.random(-25, 25),
      opacity: 0.15,
      filter: "blur(2px)",
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top+=80 top",
        end: "bottom top",
        scrub: true,
      },
    });

    gsap.set(".custom-cursor, .mouse-glow", {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });

    const cursor = document.querySelector(".custom-cursor") as HTMLDivElement;
    const glow = document.querySelector(".mouse-glow") as HTMLDivElement;

    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.2,
        ease: "power3.out",
      });

      gsap.to(glow, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.8,
        ease: "power3.out",
      });
    };

    window.addEventListener("mousemove", moveCursor);
    ScrollTrigger.refresh();

    return () => {
      smoother.kill();
      window.removeEventListener("mousemove", moveCursor);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  /* =============================
     AUDIO-REACTIVE GLOW
  ============================== */
  const startAudioAnalysis = () => {
    if (!videoRef.current) return;

    if (!audioCtxRef.current) {
      const ctx = new AudioContext();
      const source = ctx.createMediaElementSource(videoRef.current);
      const analyser = ctx.createAnalyser();

      analyser.fftSize = 256;
      source.connect(analyser);
      analyser.connect(ctx.destination);

      audioCtxRef.current = ctx;
      analyserRef.current = analyser;
      dataRef.current = new Uint8Array(analyser.frequencyBinCount);
    }

    const tick = () => {
      if (!analyserRef.current || !dataRef.current || !glowRef.current) return;

      analyserRef.current.getByteFrequencyData(dataRef.current);
      const avg =
        dataRef.current.reduce((a, b) => a + b, 0) /
        dataRef.current.length;

      const intensity = gsap.utils.clamp(0.9, 1.4, avg / 70);

      gsap.to(glowRef.current, {
        scale: intensity,
        opacity: gsap.utils.clamp(0.35, 0.65, avg / 120),
        duration: 0.3,
        ease: "power2.out",
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    tick();
  };

  const stopAudioAnalysis = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  };

  /* =============================
     PLAY / PAUSE
  ============================== */
  const togglePlay = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
      startAudioAnalysis();
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      stopAudioAnalysis();
    }
  };

  /* =============================
     PROGRESS BAR
  ============================== */
  const onTimeUpdate = () => {
    if (!videoRef.current) return;
    setProgress(
      (videoRef.current.currentTime / videoRef.current.duration) * 100
    );
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); // ✅ IMPORTANT FIX

    if (!videoRef.current || !progressRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = percent * videoRef.current.duration;
  };

  return (
    <div id="smooth-wrapper">
      {/* FIXED UI */}
      <div className="custom-cursor fixed top-0 left-0 z-50 w-3 h-3 rounded-full bg-white pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div
        ref={glowRef}
        className="mouse-glow fixed top-0 left-0 z-10 w-[420px] h-[420px] -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full bg-[radial-gradient(circle,rgba(177,18,18,0.35),transparent_70%)] blur-3xl"
      />

      <div id="smooth-content">
        <main className="relative bg-black text-white overflow-x-hidden cursor-none">
          <Background />

          {/* HERO */}
          <section className="hero h-screen flex items-center justify-center">
            <h1 className="flex gap-[3vw] text-[11vw] font-bold text-[var(--red)]">
              <span>
                {"SLAB".split("").map((c, i) => (
                  <span key={i} className="hero-char inline-block">{c}</span>
                ))}
              </span>
              <span>
                {"FANT".split("").map((c, i) => (
                  <span key={i} className="hero-char inline-block">{c}</span>
                ))}
              </span>
            </h1>
          </section>

          {/* VIDEO PLAYER */}
          <section className="min-h-[75vh] flex flex-col items-center justify-center gap-6 px-6">
            <div
              className="relative w-full max-w-4xl aspect-video rounded-xl overflow-hidden border border-neutral-800 cursor-pointer"
              onClick={togglePlay}
            >
              <video
                ref={videoRef}
                src="/song-video.mp4"
                poster="/song-thumb.jpg"
                playsInline
                className="w-full h-full object-cover"
                onTimeUpdate={onTimeUpdate}
              />

              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full border border-[var(--red)] text-[var(--red)] text-3xl flex items-center justify-center hover:scale-110 transition">
                    ▶
                  </div>
                </div>
              )}

              {/* TIME BAR */}
              <div
                ref={progressRef}
                onClick={seek}
                className="absolute bottom-0 left-0 w-full h-2 bg-neutral-900 cursor-pointer"
              >
                <div
                  className="h-full bg-[var(--red)] pointer-events-none"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* YOUTUBE BUTTON */}
            <a
              href="https://youtu.be/whCO5s2hzaE"
              target="_blank"
              rel="noopener noreferrer"
              className="yt-btn flex items-center gap-3 px-8 py-4 border border-[var(--red)] uppercase tracking-widest text-xs hover:bg-[var(--red)] hover:text-black transition"
            >
              Watch on YouTube
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
