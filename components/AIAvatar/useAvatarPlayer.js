'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

const TOTAL_FRAMES = 120;
const FRAME_PATH   = (n) => `/frames/ezgif-frame-${String(n).padStart(3, '0')}.png`;
const AUDIO_PATH   = '/frames/audio/audio.mp3';
export const FRAME_PATHS = Array.from({ length: TOTAL_FRAMES }, (_, i) => FRAME_PATH(i + 1));
export { TOTAL_FRAMES, AUDIO_PATH };

/**
 * Shared hook — handles frame preloading, canvas drawing, and audio sync.
 * Used by both the hero AIAvatar (desktop) and the mobile bottom-sheet.
 */
export function useAvatarPlayer({ autoLoad = true } = {}) {
  const canvasRef       = useRef(null);
  const containerRef    = useRef(null);
  const audioRef        = useRef(null);
  const framesRef       = useRef([]);
  const rafRef          = useRef(null);
  const audioDurRef     = useRef(null);
  const currentFrameRef = useRef(0);
  const phaseRef        = useRef('idle');

  const [loadProgress, setLoadProgress] = useState(0);
  const [assetsReady,  setAssetsReady]  = useState(false);
  const [phase,        setPhase]        = useState('idle');

  const setPhaseSync = useCallback((p) => {
    phaseRef.current = p;
    setPhase(p);
  }, []);

  // ── Draw frame ────────────────────────────────────────────────────────────
  const drawFrameAt = useCallback((index) => {
    const canvas = canvasRef.current;
    const img    = framesRef.current[index];
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    const cw  = canvas.width;
    const ch  = canvas.height;

    ctx.clearRect(0, 0, cw, ch);

    const scale = Math.min(cw / img.naturalWidth, ch / img.naturalHeight) * 1.9;
    const dw    = img.naturalWidth  * scale;
    const dh    = img.naturalHeight * scale;
    const dx    = (cw - dw) / 2;
    const dy    = (ch - dh) / 2;

    ctx.drawImage(img, dx, dy, dw, dh);
  }, []);

  // ── Sync canvas px size to CSS size ──────────────────────────────────────
  const syncCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    const parent = containerRef.current;
    if (!canvas || !parent) return;
    const w = parent.offsetWidth;
    const h = parent.offsetHeight;
    if (!w || !h) return;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width  = w;
      canvas.height = h;
    }
    drawFrameAt(currentFrameRef.current);
  }, [drawFrameAt]);

  useEffect(() => {
    const ro = new ResizeObserver(syncCanvasSize);
    if (containerRef.current) ro.observe(containerRef.current);
    syncCanvasSize();
    return () => ro.disconnect();
  }, [syncCanvasSize]);

  // ── Preload frames ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!autoLoad) return;
    let cancelled = false;
    let loaded    = 0;

    const loadBatch = (start, size) =>
      new Promise((resolve) => {
        const end   = Math.min(start + size, TOTAL_FRAMES);
        const count = end - start;
        if (count === 0) { resolve(); return; }
        let done = 0;
        for (let i = start; i < end; i++) {
          const img = new Image();
          img.src = FRAME_PATHS[i];
          img.onload = img.onerror = () => {
            if (cancelled) return;
            framesRef.current[i] = img;
            loaded++;
            done++;
            setLoadProgress(Math.round((loaded / TOTAL_FRAMES) * 100));
            if (done === count) resolve();
          };
        }
      });

    const run = async () => {
      await loadBatch(0, 1);
      if (!cancelled) { syncCanvasSize(); drawFrameAt(0); }
      for (let i = 1; i < TOTAL_FRAMES; i += 20) {
        await loadBatch(i, 20);
        if (cancelled) return;
      }
      setAssetsReady(true);
    };

    run();
    return () => { cancelled = true; };
  }, [autoLoad, drawFrameAt, syncCanvasSize]);

  // ── rAF loop ──────────────────────────────────────────────────────────────
  const animate = useCallback(() => {
    const audio    = audioRef.current;
    const duration = audioDurRef.current;

    if (!audio || !duration) {
      rafRef.current = requestAnimationFrame(animate);
      return;
    }

    const progress   = Math.min(audio.currentTime / duration, 1);
    const frameIndex = Math.min(Math.floor(progress * TOTAL_FRAMES), TOTAL_FRAMES - 1);
    currentFrameRef.current = frameIndex;
    drawFrameAt(frameIndex);

    if (progress < 1 && !audio.paused && !audio.ended) {
      rafRef.current = requestAnimationFrame(animate);
    }
  }, [drawFrameAt]);

  // ── Play ──────────────────────────────────────────────────────────────────
  const doPlay = useCallback(() => {
    if (phaseRef.current === 'playing') return;
    const audio = audioRef.current;
    if (!audio) return;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    audio.pause();
    audio.currentTime = 0;
    currentFrameRef.current = 0;
    drawFrameAt(0);

    const startAnimation = () => {
      setPhaseSync('playing');
      rafRef.current = requestAnimationFrame(animate);
    };

    audio.onended = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      currentFrameRef.current = 0;
      drawFrameAt(0);
      setPhaseSync('done');
    };

    const tryPlay = () => {
      audioDurRef.current = audio.duration && isFinite(audio.duration)
        ? audio.duration : null;

      audio.play().then(() => {
        audioDurRef.current = audio.duration;
        startAnimation();
      }).catch(() => {
        audioDurRef.current = audioDurRef.current || 5;
        startAnimation();
      });
    };

    if (audio.readyState >= 1 && isFinite(audio.duration)) {
      audioDurRef.current = audio.duration;
      tryPlay();
    } else {
      audio.addEventListener('loadedmetadata', () => {
        audioDurRef.current = audio.duration;
        tryPlay();
      }, { once: true });
      audio.load();
    }
  }, [animate, drawFrameAt, setPhaseSync]);

  // ── Cleanup ───────────────────────────────────────────────────────────────
  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  return {
    canvasRef, containerRef, audioRef,
    loadProgress, assetsReady, phase, setPhaseSync,
    drawFrameAt, syncCanvasSize, doPlay,
  };
}
