"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* ============================================================
   CONFIG — matches your "videotoimagw" folder inside /public
   Files: public/videotoimagw/ezgif-frame-001.jpg ... 300.jpg
   ============================================================ */
const FRAME_COUNT = 300;
const FRAME_START = 1;
const FRAME_FOLDER = "/videotoimagw"; // served from /public, so this is the URL path
const framePath = (i: number) =>
  `${FRAME_FOLDER}/ezgif-frame-${String(i).padStart(3, "0")}.jpg`;

const SCRUB_SMOOTHING = 0.15; // 0 = instant snap, higher = smoother/laggier
const PIN_HEIGHT_VH = 500; // total scroll distance (in vh) the sequence plays over

export default function ScrollSequence() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loaderFillRef = useRef<HTMLDivElement>(null);
  const loaderTextRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: false })!;
    const pinEl = pinRef.current!;
    const sectionEl = sectionRef.current!;

    const images: HTMLImageElement[] = new Array(FRAME_COUNT);
    const seq = { frame: 0 };
    let loadedCount = 0;
    let ready = false;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let st: ScrollTrigger | null = null;
    let tween: gsap.core.Tween | null = null;

    function resizeCanvas() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = pinEl.clientWidth * dpr;
      canvas.height = pinEl.clientHeight * dpr;
      canvas.style.width = pinEl.clientWidth + "px";
      canvas.style.height = pinEl.clientHeight + "px";
      render();
    }

    // Cover-fit draw so frames stay sharp and centered on any screen,
    // including mobile, without stretching.
    function drawImageCover(img: HTMLImageElement) {
      if (!img || !img.complete || !img.naturalWidth) return;

      const canvasRatio = canvas.width / canvas.height;
      const imgRatio = img.naturalWidth / img.naturalHeight;

      let drawW: number, drawH: number, offsetX: number, offsetY: number;

      if (imgRatio > canvasRatio) {
        drawH = canvas.height;
        drawW = drawH * imgRatio;
        offsetX = (canvas.width - drawW) / 2;
        offsetY = 0;
      } else {
        drawW = canvas.width;
        drawH = drawW / imgRatio;
        offsetX = 0;
        offsetY = (canvas.height - drawH) / 2;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
    }

    function render() {
      const idx = Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(seq.frame)));
      const img = images[idx];
      if (img && img.complete && img.naturalWidth) drawImageCover(img);
    }

    function updateLoaderUI() {
      const pct = Math.round((loadedCount / FRAME_COUNT) * 100);
      if (loaderFillRef.current) loaderFillRef.current.style.width = pct + "%";
      if (loaderTextRef.current) loaderTextRef.current.textContent = `Loading ${pct}%`;
    }

    function preloadFrames() {
      let firstDrawn = false;

      for (let i = 0; i < FRAME_COUNT; i++) {
        const img = new Image();
        img.decoding = "async";
        img.src = framePath(i + FRAME_START);

        img.onload = () => {
          loadedCount++;
          updateLoaderUI();
          if (!firstDrawn) {
            firstDrawn = true;
            resizeCanvas();
          }
          if (loadedCount === FRAME_COUNT) onAllFramesLoaded();
        };

        img.onerror = () => {
          loadedCount++;
          updateLoaderUI();
          console.warn("Failed to load frame:", img.src);
          if (loadedCount === FRAME_COUNT) onAllFramesLoaded();
        };

        images[i] = img;
      }

      // Graceful fallback if frames genuinely fail (bad path, missing files, etc.)
      setTimeout(() => {
        if (!ready) {
          const anyLoaded = images.some((img) => img.complete && img.naturalWidth);
          if (!anyLoaded && errorRef.current && loaderRef.current) {
            loaderRef.current.style.opacity = "0";
            loaderRef.current.style.pointerEvents = "none";
            errorRef.current.style.display = "flex";
          }
        }
      }, 12000);
    }

    function onAllFramesLoaded() {
      ready = true;
      if (loaderRef.current) {
        loaderRef.current.style.opacity = "0";
        loaderRef.current.style.pointerEvents = "none";
      }
      resizeCanvas();
      render();
      setupScrollTrigger();
    }

    function setupScrollTrigger() {
      tween = gsap.to(seq, {
        frame: FRAME_COUNT - 1,
        ease: "none",
        scrollTrigger: {
          trigger: sectionEl,
          start: "top top",
          end: "bottom bottom",
          scrub: SCRUB_SMOOTHING,
          pin: pinEl,
          pinSpacing: false,
          anticipatePin: 1,
          onUpdate: render,
        },
      });
      st = tween.scrollTrigger ?? null;
    }

    const handleResize = () => {
      if (ready) resizeCanvas();
    };
    window.addEventListener("resize", handleResize);

    updateLoaderUI();
    preloadFrames();

    return () => {
      window.removeEventListener("resize", handleResize);
      st?.kill();
      tween?.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{ position: "relative", width: "100%", height: `${PIN_HEIGHT_VH}vh` }}
    >
      <div
        ref={pinRef}
        style={{
          position: "relative",
          width: "100%",
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0b0c",
        }}
      >
        <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />

        <div
          ref={loaderRef}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            background: "#0b0b0c",
            zIndex: 5,
            transition: "opacity 0.5s ease",
          }}
        >
          <div
            style={{
              width: 180,
              height: 2,
              background: "rgba(255,255,255,0.15)",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <div
              ref={loaderFillRef}
              style={{
                height: "100%",
                width: "0%",
                background: "#ffffff",
                transition: "width 0.15s ease-out",
              }}
            />
          </div>
          <div
            ref={loaderTextRef}
            style={{
              fontSize: 12,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              opacity: 0.6,
              color: "#fff",
            }}
          >
            Loading 0%
          </div>
        </div>

        <div
          ref={errorRef}
          style={{
            position: "absolute",
            inset: 0,
            display: "none",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: 24,
            background: "#0b0b0c",
            color: "#fff",
            fontSize: 14,
            opacity: 0.8,
            zIndex: 6,
          }}
        >
          Couldn&apos;t load the image sequence. Check that /public/videotoimagw
          contains ezgif-frame-001.jpg through ezgif-frame-300.jpg.
        </div>
      </div>
    </section>
  );
}