import { useEffect, useRef } from "react";

// Slowly rotating wireframe globe: points on a sphere joined to their near neighbours.
export default function Network() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current, x = c.getContext("2d");
    const dpr = Math.min(devicePixelRatio || 1, 2), S = 420;
    c.width = c.height = S * dpr; x.scale(dpr, dpr);
    const N = 130, P = [];
    for (let i = 0; i < N; i++) {
      const y = 1 - (2 * (i + 0.5)) / N, r = Math.sqrt(1 - y * y), a = i * 2.399963;
      P.push([Math.cos(a) * r, y, Math.sin(a) * r]);
    }
    const E = [];
    for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
      const dx = P[i][0] - P[j][0], dy = P[i][1] - P[j][1], dz = P[i][2] - P[j][2];
      if (dx * dx + dy * dy + dz * dz < 0.36) E.push([i, j]);
    }
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let a = 0, raf;
    const tilt = 0.35, ct = Math.cos(tilt), st = Math.sin(tilt), R = S * 0.4;
    const frame = () => {
      x.clearRect(0, 0, S, S);
      const ca = Math.cos(a), sa = Math.sin(a);
      const Q = P.map((p) => {
        const X = p[0] * ca + p[2] * sa, Z0 = -p[0] * sa + p[2] * ca;
        const Y = p[1] * ct - Z0 * st, Z = p[1] * st + Z0 * ct;
        return [S / 2 + X * R, S / 2 + Y * R, Z];
      });
      x.lineWidth = 1;
      for (const [i, j] of E) {
        const z = (Q[i][2] + Q[j][2]) / 2;
        x.strokeStyle = `rgba(111,168,220,${0.08 + 0.3 * (z + 1) / 2})`;
        x.beginPath(); x.moveTo(Q[i][0], Q[i][1]); x.lineTo(Q[j][0], Q[j][1]); x.stroke();
      }
      for (const q of Q) {
        x.fillStyle = `rgba(200,225,250,${0.25 + 0.6 * (q[2] + 1) / 2})`;
        x.beginPath(); x.arc(q[0], q[1], 1.6, 0, 7); x.fill();
      }
      if (!reduce && !document.hidden) { a += 0.004; }
      if (!reduce) raf = requestAnimationFrame(frame);
    };
    frame();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={ref} className="globe" aria-hidden="true" />;
}