"use client";

import { useEffect, useRef } from "react";

const SEGMENTS = [
  { start: 0, end: 75, file: "/audio/01-wavin-flag.mp3" },
  { start: 75, end: 150, file: "/audio/02-waka-waka.mp3" },
  { start: 150, end: 220, file: "/audio/03-we-are-one.mp3" },
  { start: 220, end: 285, file: "/audio/04-la-la-la.mp3" },
  { start: 285, end: 350, file: "/audio/05-world-cup-champions.mp3" },
  { start: 350, end: 420, file: "/audio/06-dai-dai.mp3" },
];

const TOTAL = 420;
const VOLUME = 0.4;

export function MashupPlayer() {
  const audioARef = useRef<HTMLAudioElement | null>(null);
  const audioBRef = useRef<HTMLAudioElement | null>(null);
  const activeRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const timeRef = useRef(0);
  const segIdxRef = useRef(0);
  const lastFrameRef = useRef<number | null>(null);
  const startedRef = useRef(false);
  const crossfadingRef = useRef(false);

  useEffect(() => {
    // Create two audio elements with first file preloaded
    const a1 = new Audio();
    a1.preload = "auto";
    a1.src = SEGMENTS[0].file;
    a1.volume = VOLUME;
    a1.load();

    const a2 = new Audio();
    a2.preload = "auto";
    a2.volume = VOLUME;

    audioARef.current = a1;
    audioBRef.current = a2;
    activeRef.current = a1;

    // Preload remaining files
    for (let i = 1; i < SEGMENTS.length; i++) {
      const pre = new Audio(SEGMENTS[i].file);
      pre.preload = "auto";
    }

    let cancelled = false;

    const crossfade = async (toAudio: HTMLAudioElement, fromAudio: HTMLAudioElement, segIdx: number) => {
      if (crossfadingRef.current) return;
      crossfadingRef.current = true;
      const seg = SEGMENTS[segIdx];
      toAudio.src = seg.file;
      toAudio.currentTime = 0;
      try {
        await toAudio.play();
        // Quick fade in (300ms)
        toAudio.volume = 0;
        for (let i = 1; i <= 10; i++) {
          if (cancelled) { crossfadingRef.current = false; return; }
          toAudio.volume = (VOLUME * i) / 10;
          await new Promise((r) => setTimeout(r, 30));
        }
        // Fade out old (300ms)
        const oldVol = fromAudio.volume;
        for (let i = 1; i <= 10; i++) {
          if (cancelled) { crossfadingRef.current = false; return; }
          fromAudio.volume = oldVol * (1 - i / 10);
          await new Promise((r) => setTimeout(r, 30));
        }
        fromAudio.pause();
        fromAudio.volume = VOLUME;
      } catch (e) {
        console.error("[Music] crossfade failed:", e);
      }
      crossfadingRef.current = false;
    };

    const loop = () => {
      if (cancelled) return;
      const now = performance.now();
      if (lastFrameRef.current === null) lastFrameRef.current = now;
      const delta = (now - lastFrameRef.current) / 1000;
      lastFrameRef.current = now;
      timeRef.current += delta;

      // Check segment boundary (1s before)
      const curSeg = segIdxRef.current;
      if (curSeg < SEGMENTS.length - 1 && timeRef.current >= SEGMENTS[curSeg + 1].start - 1) {
        segIdxRef.current = curSeg + 1;
        const from = activeRef.current;
        const to = from === audioARef.current ? audioBRef.current : audioARef.current;
        if (to) {
          activeRef.current = to;
          crossfade(to, from, segIdxRef.current);
        }
      }

      // Loop back to start
      if (timeRef.current >= TOTAL) {
        timeRef.current = 0;
        segIdxRef.current = 0;
        const from = activeRef.current;
        const to = from === audioARef.current ? audioBRef.current : audioARef.current;
        if (to) {
          activeRef.current = to;
          crossfade(to, from, 0);
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    const start = async () => {
      if (startedRef.current || cancelled) return;
      startedRef.current = true;

      const audio = audioARef.current;
      if (!audio) return;

      // Audio is already loaded with the first file
      audio.currentTime = 0;
      audio.volume = VOLUME;
      try {
        await audio.play();
        lastFrameRef.current = null;
        rafRef.current = requestAnimationFrame(loop);
      } catch (e) {
        console.error("[Music] Start failed:", e);
        startedRef.current = false;
      }

      // Remove all listeners after starting
      ["pointerdown", "click", "keydown", "touchstart", "wheel"].forEach((evt) => {
        document.removeEventListener(evt, start, true);
      });
    };

    // Use pointerdown (capture phase) — most reliable for autoplay policy
    ["pointerdown", "click", "keydown", "touchstart", "wheel"].forEach((evt) => {
      document.addEventListener(evt, start, true);
    });

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ["pointerdown", "click", "keydown", "touchstart", "wheel"].forEach((evt) => {
        document.removeEventListener(evt, start, true);
      });
      a1.pause();
      a2.pause();
    };
  }, []);

  return null;
}
