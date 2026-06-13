'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerAvatarPlay } from '../AIAvatar';

export default function AIAvatarFAB() {
  const [visible, setVisible] = useState(false);
  const [pulse,   setPulse]   = useState(false);

  // Show FAB after a short delay so it doesn't flash on first load
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(t);
  }, []);

  // Gentle pulse every 6s to draw attention
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 800);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = useCallback(() => {
    // 1. Scroll to the home section
    const homeEl = document.getElementById('home');
    if (homeEl) {
      homeEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // 2. Wait for scroll to settle, then trigger the avatar
    //    Use a generous delay so the avatar is in view before audio starts
    setTimeout(() => {
      triggerAvatarPlay();
    }, 700);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          className={`ai-avatar-fab${pulse ? ' ai-avatar-fab--pulse' : ''}`}
          onClick={handleClick}
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.94 }}
          title="Activate AI Assistant"
          aria-label="Activate AI Assistant"
        >
          <span className="ai-avatar-fab__icon">🎙</span>
          <span className="ai-avatar-fab__label">AI</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
