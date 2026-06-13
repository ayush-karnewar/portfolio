'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TOTAL_FRAMES = 120;
const FRAME_PATH   = (n) => `/frames/ezgif-frame-${String(n).padStart(3, '0')}.png`;
const AUDIO_PATH   = '/frames/audio/audio.mp3';
const FRAME_PATHS  = Array.from({ length: TOTAL_FRAMES }, (_, i) => FRAME_PATH(i + 1));

// ─── Shared play-trigger so the global FAB can fire it from anywhere ──────────
let _triggerPlay = null;
export function triggerAvatarPlay() {
  if (_triggerPlay) _triggerPlay();
}

export default function AIAvatar() {
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

  const setPhaseSync = (p) => { phaseRef.current = p; setPhase(p); };

  // ── Draw frame: contain-fit, vertically centered ──────────────────────────
  const drawFrameAt = useCallback((index) => {
    const canvas = canvasRef.current;
    const img    = framesRef.current[index];
    if (!canvas || !img) return;

    const ctx  = canvas.getContext('2d');
    const cw   = canvas.width;
    const ch   = canvas.height;

    ctx.clearRect(0, 0, cw, ch);

    // Scale to contain, then offset upward by 8% of canvas height so the
    // character appears slightly above centre (not pinned to the bottom)
    const scale = Math.min(cw / img.naturalWidth, ch / img.naturalHeight) * 1.9; // +5% + extra 10%
    const dw    = img.naturalWidth  * scale;
    const dh    = img.naturalHeight * scale;
    const dx    = (cw - dw) / 2;                       // horizontally centred
    const dy    = (ch - dh) / 2 ;           // vertically centred, shifted up 8%

    ctx.drawImage(img, dx, dy, dw, dh);
  }, []);

  // ── Sync canvas pixel size to its CSS size ────────────────────────────────
  const syncCanvasSize = useCallback(() => {
    const canvas  = canvasRef.current;
    const parent  = containerRef.current;
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

  // ── Preload frames in batches ─────────────────────────────────────────────
  useEffect(() => {
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
  }, [drawFrameAt, syncCanvasSize]);

  // ── rAF loop — driven by audio.currentTime (self-correcting, no drift) ──────
  const animate = useCallback(() => {
    const audio    = audioRef.current;
    const duration = audioDurRef.current;

    if (!audio || !duration) {
      rafRef.current = requestAnimationFrame(animate);
      return;
    }

    // Use audio.currentTime as ground truth — corrects itself every frame
    const progress   = Math.min(audio.currentTime / duration, 1);
    const frameIndex = Math.min(Math.floor(progress * TOTAL_FRAMES), TOTAL_FRAMES - 1);
    currentFrameRef.current = frameIndex;
    drawFrameAt(frameIndex);

    if (progress < 1 && !audio.paused && !audio.ended) {
      rafRef.current = requestAnimationFrame(animate);
    }
  }, [drawFrameAt]);

  // ── Core play function ────────────────────────────────────────────────────
  const doPlay = useCallback(() => {
    if (phaseRef.current === 'playing') return;
    const audio = audioRef.current;
    if (!audio) return;

    // Cancel any running animation
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

    // Ensure we have duration before playing
    const tryPlay = () => {
      audioDurRef.current = audio.duration && isFinite(audio.duration)
        ? audio.duration
        : null;

      audio.play().then(() => {
        // After play resolves, duration is definitely available
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
  }, [animate, drawFrameAt]);

  // ── Expose trigger for the global FAB ────────────────────────────────────
  useEffect(() => {
    _triggerPlay = doPlay;
    return () => { if (_triggerPlay === doPlay) _triggerPlay = null; };
  }, [doPlay]);

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  return (
    <div className="ai-avatar-wrapper">
      <audio ref={audioRef} preload="auto" src={AUDIO_PATH} />

      <div ref={containerRef} className="ai-avatar-canvas-container">
        <canvas ref={canvasRef} className="ai-avatar-canvas" />

        <AnimatePresence>
          {!assetsReady && (
            <motion.div
              className="ai-avatar-loading"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="ai-avatar-loading-bar">
                <div className="ai-avatar-loading-fill" style={{ width: `${loadProgress}%` }} />
              </div>
              <span className="ai-avatar-loading-text">{loadProgress}%</span>
            </motion.div>
          )}
        </AnimatePresence>

        {phase === 'playing' && (
          <motion.div
            className="ai-avatar-glow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>

      {/* Button area removed — FAB handles playback from anywhere */}
    </div>
  );
}
