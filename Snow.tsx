import { useEffect, useRef } from "react";
import { useReducedMotion } from "./lib";
import { snowTarget } from "./snowState";

interface Flake {
  x: number;
  y: number;
  r: number; // radius
  z: number; // depth 0 (far) → 1 (near)
  ph: number; // sway phase
  fr: number; // sway speed
  amp: number; // sway width
  a: number; // opacity
}

/**
 * Snow that always falls behind the page. Near flakes are bigger and faster.
 * When the shared snow speed rises (an animation is opening / loading) the
 * flakes accelerate smoothly and stretch into streaks, then settle again.
 * Honours "reduce motion": then it is a still picture of snow.
 */
export default function Snow() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    let last = 0;
    let t = 0;
    let mul = 1;
    let flakes: Flake[] = [];
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);

    const make = (): Flake => {
      const z = Math.random();
      return {
        x: rnd(0, w),
        y: rnd(0, h),
        r: 0.7 + z * 2.3,
        z,
        ph: rnd(0, 6.28),
        fr: rnd(0.4, 1.1),
        amp: rnd(8, 26) * (0.4 + z),
        a: 0.35 + z * 0.55,
      };
    };

    const fit = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const want = Math.max(70, Math.min(190, Math.round((w * h) / 8500)));
      while (flakes.length < want) flakes.push(make());
      if (flakes.length > want) flakes.length = want;
      for (const f of flakes) {
        if (f.x > w) f.x = rnd(0, w);
        if (f.y > h) f.y = rnd(0, h);
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = "#ffffff";
      ctx.lineCap = "round";
      const stretch = Math.max(0, (mul - 1) / 6) * 0.034;
      for (const f of flakes) {
        const vy = (22 + f.z * 58) * mul;
        const vx = 12 * mul * (0.4 + f.z);
        ctx.globalAlpha = f.a;
        ctx.lineWidth = f.r * 2;
        ctx.beginPath();
        ctx.moveTo(f.x, f.y);
        ctx.lineTo(f.x - vx * stretch - 0.01, f.y - vy * stretch - 0.01);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000 || 0, 0.05);
      last = now;
      t += dt;
      const target = snowTarget(now);
      mul += (target - mul) * Math.min(1, dt * (target > mul ? 2.6 : 1.1));

      for (const f of flakes) {
        const vy = (22 + f.z * 58) * mul;
        const sway = Math.sin(t * f.fr + f.ph) * f.amp;
        f.y += vy * dt;
        f.x += (sway * 0.5 + 12 * mul * (0.4 + f.z)) * dt;
        if (f.y > h + 12) {
          f.y = -12;
          f.x = rnd(0, w);
        }
        if (f.x > w + 12) f.x = -12;
      }
      draw();
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (raf || reduced) return;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    const onResize = () => {
      fit();
      if (reduced) draw();
    };

    fit();
    if (reduced) {
      draw(); // one still frame, no movement
    } else {
      start();
    }
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced]);

  return <canvas ref={ref} className="snow" aria-hidden="true" />;
}
