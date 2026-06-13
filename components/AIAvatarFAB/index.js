'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAvatarPlayer } from '../AIAvatar/useAvatarPlayer';
import { triggerAvatarPlay } from '../AIAvatar';

export default function AIAvatarFAB() {
  const [visible,   setVisible]   = useState(false);
  const [pulse,     setPulse]     = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isMobile,  setIsMobile]  = useState(false);

  // Detect mobile — only show sheet on ≤900px
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 900);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Show FAB after 1.2s
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(t);
  }, []);

  // Periodic pulse ring
  useEffect(() => {
    const iv = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 800);
    }, 6000);
    return () => clearInterval(iv);
  }, []);

  // Avatar player — frames preload immediately in background
  const {
    canvasRef, containerRef, audioRef,
    loadProgress, assetsReady, phase,
    doPlay, syncCanvasSize,
  } = useAvatarPlayer({ autoLoad: true });

  // When sheet opens: wait for render → sync canvas → play
  useEffect(() => {
    if (sheetOpen) {
      const t = setTimeout(() => {
        syncCanvasSize();
        doPlay();
      }, 400);
      return () => clearTimeout(t);
    } else {
      const audio = audioRef.current;
      if (audio) { audio.pause(); audio.currentTime = 0; }
    }
  }, [sheetOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Escape key closes sheet
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') setSheetOpen(false); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const openSheet  = useCallback(() => setSheetOpen(true), []);
  const closeSheet = useCallback(() => setSheetOpen(false), []);

  const handleFabClick = useCallback(() => {
    if (isMobile) {
      // Mobile: open bottom sheet
      openSheet();
    } else {
      // Desktop: scroll to hero then play in-place avatar
      const el = document.getElementById('home');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => triggerAvatarPlay(), 700);
    }
  }, [isMobile, openSheet]);

  return (
    <>
      {/* Audio always mounted so ref is always valid */}
      <audio ref={audioRef} preload="auto" src="/frames/audio/audio.mp3" />

      {/* FAB button */}
      <AnimatePresence>
        {visible && (
          <motion.button
            className={`ai-avatar-fab${pulse ? ' ai-avatar-fab--pulse' : ''}`}
            onClick={handleFabClick}
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.94 }}
            title="Activate AI Assistant"
            aria-label="Activate AI Assistant"
          >
            <span className="ai-avatar-fab__icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm-2 4v6a2 2 0 0 0 4 0V5a2 2 0 0 0-4 0z"/>
                <path d="M5.5 10.5a1 1 0 0 1 1 1 5.5 5.5 0 0 0 11 0 1 1 0 1 1 2 0 7.5 7.5 0 0 1-6.5 7.43V21h2a1 1 0 1 1 0 2h-6a1 1 0 1 1 0-2h2v-2.07A7.5 7.5 0 0 1 4.5 11.5a1 1 0 0 1 1-1z"/>
              </svg>
            </span>
            <span className="ai-avatar-fab__label">AI</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Bottom sheet */}
      <AnimatePresence>
        {sheetOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="ai-mobile-sheet-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closeSheet}
            />

            {/* Sheet panel */}
            <motion.div
              className="ai-mobile-sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            >
              {/* Handle + close */}
              <div className="ai-mobile-sheet-header">
                <div className="ai-mobile-sheet-drag-handle" />
                <button
                  className="ai-mobile-sheet-close"
                  onClick={closeSheet}
                  aria-label="Close"
                >✕</button>
              </div>

              {/* Canvas */}
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
                  <motion.div className="ai-mobile-sheet-speaking"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <span className="ai-avatar-pulse-dot" />Speaking…
                  </motion.div>
                )}
                {phase === 'done' && (
                  <motion.button className="ai-button ai-mobile-sheet-replay-btn"
                    onClick={doPlay}
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                    ↩ Replay Introduction
                  </motion.button>
                )}
                {phase === 'idle' && assetsReady && (
                  <motion.button className="ai-button ai-mobile-sheet-replay-btn"
                    onClick={doPlay}
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
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
