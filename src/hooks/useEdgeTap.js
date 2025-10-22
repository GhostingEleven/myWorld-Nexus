// src/hooks/useEdgeTap.js
export default function useEdgeTap({ onLeft, onRight, edgePercent = 0.18 }) {
  function onClick(e) {
    const w = window.innerWidth;
    const x = e.clientX;
    if (x <= w * edgePercent) {
      onLeft?.();
    } else if (x >= w * (1 - edgePercent)) {
      onRight?.();
    }
  }

  return { onClick };
}
