import React, { useEffect, useRef } from "react";

export default function Starfield() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: true });
    let w, h, stars;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const STAR_COUNT = 240;         // adjust density
    const DEPTH = 0.02;             // parallax speed

    function resize() {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      ctx.scale(DPR, DPR);

      stars = new Array(STAR_COUNT).fill(0).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random() * 1 + 0.2,
        r: Math.random() * 1.2 + 0.2
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);

      // faint nebula haze
      const grd = ctx.createRadialGradient(w*0.65, h*0.35, 0, w*0.65, h*0.35, Math.max(w,h)*0.8);
      grd.addColorStop(0, "rgba(59,224,255,0.08)");
      grd.addColorStop(0.4, "rgba(138,124,255,0.05)");
      grd.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);

      // stars
      for (const s of stars) {
        s.x += DEPTH * s.z;
        if (s.x > w + 2) s.x = -2;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.fill();

        // tiny blue aura
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r*2.2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(59,224,255,0.15)";
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 block w-full h-full pointer-events-none"
    />
  );
}
