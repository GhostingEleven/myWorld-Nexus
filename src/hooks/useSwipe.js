// src/hooks/useSwipe.js
import { useRef } from "react";

export default function useSwipe({ onLeft, onRight, threshold = 50 }) {
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  function onTouchStart(e) {
    const t = e.touches?.[0];
    if (!t) return;
    touchStartX.current = t.clientX;
    touchStartY.current = t.clientY;
  }

  function onTouchEnd(e) {
    const t = e.changedTouches?.[0];
    if (!t || touchStartX.current == null) return;

    const dx = t.clientX - touchStartX.current;
    const dy = Math.abs(t.clientY - touchStartY.current);

    // only trigger if mostly horizontal
    if (Math.abs(dx) > threshold && dy < 80) {
      if (dx < 0) onLeft?.();  // swipe left = next
      else onRight?.();        // swipe right = prev
    }

    touchStartX.current = null;
    touchStartY.current = null;
  }

  return {
    onTouchStart,
    onTouchEnd,
  };
}
