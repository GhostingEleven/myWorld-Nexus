// src/components/RouteFade.jsx
import React, { useEffect, useRef, useState } from "react";

/**
 * Wrap your <Routes> with <RouteFade> to get a quick fade transition
 * whenever locationKey changes. No external libs.
 */
export default function RouteFade({ children, duration = 180, locationKey }) {
  const [visible, setVisible] = useState(true);
  const prevKeyRef = useRef(locationKey);

  useEffect(() => {
    if (prevKeyRef.current !== locationKey) {
      // Fade out then in on route change
      setVisible(false);
      const out = setTimeout(() => {
        prevKeyRef.current = locationKey;
        setVisible(true);
      }, duration);
      return () => clearTimeout(out);
    }
  }, [locationKey, duration]);

  return (
    <div
      style={{
        transition: `opacity ${duration}ms ease`,
        opacity: visible ? 1 : 0,
      }}
    >
      {children}
    </div>
  );
}
