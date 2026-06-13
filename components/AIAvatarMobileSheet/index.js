'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAvatarPlayer } from '../AIAvatar/useAvatarPlayer';

export default function AIAvatarMobileSheet({ open, onClose }) {
  const {
    canvasRef, containerRef, audioRef,
    loadProgress, assetsReady, phase,
    doPlay, syncCanvasSize,
  } = useAvatarPlayer({ autoLoad: true }); // always preload

  const didPlayRef = useRef(false);

  // When sheet opens: sync canvas size (now it has real dimensions) then play
  useEffect(() => {
    if (open) {
      didPlayRef.current = false;
      // Give the sheet animation one frame to render at full size, then sync + play
      const t = setTimeout(() => {
        syncCanvasSize();
        doPlay();
        didPlayRef.current = true;
      }, 350);
      return () => clearTimeout(t);
    } else {
      // Stop when closed
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      didPlayRef.current = false;
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Escape key to close
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <>
      <audio ref={audioRef} preload="auto" src="/frames/audio/audio.mp3" />

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="ai-mobile-sheet-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={onClose}
            />

            {/* Sheet */}
            <motion.div
              className="ai-mobile-sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            >
              {/* Header */}
              <div className="ai-mobile-sheet-header">
                <div className="ai-mobile-sheet-drag-handle" />
                <button
                  className="ai-mobile-sheet-close"
                  onClick={onClose}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {/* Canvas area */}
              <div ref={containerRef} className="ai-mobile-sheet-canvas-container">
                <canvas ref={canvasRef} className="ai-avatar-canvas" />

                <AnimatePresence>
                  {!assetsReady && (
                    <motion.div
                      className="ai-avatar-loading ai-mobile-loading"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="ai-avatar-loading-bar">
                        <div className="ai-avatar-loading-fill" style={{ width: `${loadProgress}%` }} />
                      </div>
                      <span className="ai-avatar-loading-text">
                        {loadProgress < 100 ? `Loading… ${loadProgress}%` : 'Starting…'}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Status */}
              <div className="ai-mobile-sheet-status">
                {phase === 'playing' && (
                  <motion.div
                    className="ai-mobile-sheet-speaking"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <span className="ai-avatar-pulse-dot" />
                    Speaking…
                  </motion.div>
                )}
                {phase === 'done' && (
                  <motion.button
                    className="ai-button ai-mobile-sheet-replay-btn"
                    onClick={doPlay}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    ↩ Replay Introduction
                  </motion.button>
                )}
                {(phase === 'idle') && assetsReady && (
                  <motion.button
                    className="ai-button ai-mobile-sheet-replay-btn"
                    onClick={doPlay}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    🎙 Play Introduction
                  </motion.button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
