'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAvatarPlayer } from './useAvatarPlayer';

// ─── Shared trigger for the global FAB ───────────────────────────────────────
let _triggerPlay = null;
export function triggerAvatarPlay() {
  if (_triggerPlay) _triggerPlay();
}

export default function AIAvatar() {
  const {
    canvasRef, containerRef, audioRef,
    loadProgress, assetsReady, phase,
    doPlay,
  } = useAvatarPlayer();

  // Expose play to FAB
  useEffect(() => {
    _triggerPlay = doPlay;
    return () => { if (_triggerPlay === doPlay) _triggerPlay = null; };
  }, [doPlay]);

  return (
    <div className="ai-avatar-wrapper">
      <audio ref={audioRef} preload="auto" src="/frames/audio/audio.mp3" />

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
    </div>
  );
}
