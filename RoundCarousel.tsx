import { useEffect, useRef, useState } from "react";
import { assetUrl, useOnScreen, useReducedMotion } from "./lib";
import { Placeholder } from "./Media";

/**
 * Round Carousel (Originkit) — adapted for this site.
 *
 * Kept from the original: the rotating 3D ring, perspective, tilt, speed,
 * direction, drag with inertia, and the dimmed inside face.
 *
 * Added: clickable + keyboard-accessible faces (real links with labels),
 * click-vs-drag detection, vertical page scrolling still works on touch,
 * pauses when off screen / hovered / focused, honours reduced motion,
 * and shows a labelled placeholder when a picture file is missing.
 */
export interface RoundCarouselItem {
  src: string; // file name or full link
  title: string; // used for the accessible label
  href: string; // where a click goes, e.g. "#/animations/untitled-one"
}

interface RoundCarouselProps {
  items: RoundCarouselItem[];
  imageWidth?: number;
  imageHeight?: number;
  spacing?: number;
  speed?: number;
  direction?: "right" | "left";
  drag?: boolean;
  sensitivity?: number;
  tilt?: number;
  perspective?: number;
  cornerRadius?: number;
  innerDim?: number;
  background?: string;
}

function Face({ item, back = false, cornerRadius }: { item: RoundCarouselItem; back?: boolean; cornerRadius: number }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [item.src]);
  return (
    <div className="ring__face-art" style={{ borderRadius: cornerRadius }}>
      {item.src && !failed ? (
        <img
          src={assetUrl(item.src)}
          alt={back ? "" : item.title}
          draggable={false}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <Placeholder file={item.src} kind="Thumbnail" />
      )}
    </div>
  );
}

export default function RoundCarousel({
  items: given,
  imageWidth = 300,
  imageHeight = 300,
  spacing = 3,
  speed = 7,
  direction = "right",
  drag = true,
  sensitivity = 5,
  tilt = -7,
  perspective = 3000,
  cornerRadius = 22,
  innerDim = 3.5,
  background = "transparent",
}: RoundCarouselProps) {
  // A ring needs enough faces to look round; repeat short lists.
  const items: RoundCarouselItem[] = [];
  const minFaces = 6;
  const reps = Math.max(1, Math.ceil(minFaces / Math.max(given.length, 1)));
  for (let r = 0; r < reps; r++) items.push(...given);
  const count = items.length;

  const reduced = useReducedMotion();
  const [wrapRef, onScreen] = useOnScreen<HTMLDivElement>("0px");
  const ringRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const rotYRef = useRef(0);
  const velRef = useRef(0);
  const lastRef = useRef(0);
  const pausedRef = useRef(false); // hover / focus
  const dragRef = useRef({ active: false, x: 0, moved: 0, id: -1 });
  const suppressClick = useRef(false);
  const faceEls = useRef<(HTMLAnchorElement | null)[]>([]);
  const faceFront = useRef<boolean[]>([]);

  const angle = 360 / count;
  const factor = 1 + spacing * 0.15;
  const radius = (imageWidth * factor) / (2 * Math.tan(Math.PI / count));
  const degPerSec = reduced ? 0 : speed * 6 * (direction === "left" ? -1 : 1);

  useEffect(() => {
    const ring = ringRef.current;
    if (!ring) return;
    const apply = () => {
      ring.style.transform = `translateZ(${-radius}px) rotateY(${rotYRef.current}deg)`;
      // Only the faces turned toward the visitor can be clicked. (Browsers
      // don't reliably ignore hidden back-sides when deciding what is clicked.)
      for (let i = 0; i < count; i++) {
        const a = ((i * angle + rotYRef.current) * Math.PI) / 180;
        const front = Math.cos(a) > 0.05;
        if (faceFront.current[i] !== front) {
          faceFront.current[i] = front;
          const el = faceEls.current[i];
          if (el) el.style.pointerEvents = front ? "auto" : "none";
        }
      }
    };
    apply();
    if (!onScreen) return; // not visible: stop the animation loop completely

    lastRef.current = 0;
    const draw = (now: number) => {
      const dt = lastRef.current ? (now - lastRef.current) / 1000 : 0;
      lastRef.current = now;
      const f = Math.min(dt, 0.1);
      const d = dragRef.current;
      if (!d.active) {
        if (Math.abs(velRef.current) > 0.01) {
          rotYRef.current += velRef.current * f;
          velRef.current *= 0.94;
        } else if (!pausedRef.current) {
          rotYRef.current += degPerSec * f;
        }
      }
      apply();
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [radius, degPerSec, count, angle, onScreen]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (!drag) return;
    dragRef.current = { active: true, x: e.clientX, moved: 0, id: e.pointerId };
    velRef.current = 0;
    suppressClick.current = false;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d.active) return;
    const dx = e.clientX - d.x;
    d.x = e.clientX;
    d.moved += Math.abs(dx);
    if (d.moved > 6) {
      // Only now is it a drag (not a tap): capture so we keep getting moves.
      if (!suppressClick.current) {
        suppressClick.current = true;
        (e.currentTarget as HTMLElement).setPointerCapture?.(d.id);
      }
      const k = 0.3 * sensitivity;
      rotYRef.current += dx * k;
      velRef.current = dx * k * 60;
    }
  };
  const onPointerUp = (e: React.PointerEvent) => {
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture?.(dragRef.current.id);
    } catch {
      /* not captured */
    }
    dragRef.current.active = false;
    // let the click handler (which runs right after) see that this was a drag
    window.setTimeout(() => (suppressClick.current = false), 0);
  };

  // Arrow keys turn the ring when a face has focus.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") velRef.current = 90;
    if (e.key === "ArrowRight") velRef.current = -90;
  };

  return (
    <div
      ref={wrapRef}
      className="ring"
      style={{ background, perspective: `${perspective}px`, cursor: drag ? "grab" : "default" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
      onFocusCapture={() => (pausedRef.current = true)}
      onBlurCapture={() => (pausedRef.current = false)}
      onKeyDown={onKeyDown}
    >
      <div style={{ transformStyle: "preserve-3d", transform: `rotateX(${tilt}deg)` }}>
        <div
          ref={ringRef}
          style={{
            position: "relative",
            width: imageWidth,
            height: imageHeight,
            transformStyle: "preserve-3d",
          }}
        >
          {items.map((item, i) => {
            const isCopy = i >= given.length; // repeated faces are hidden from screen readers
            return (
              <div
                key={i}
                className="ring__slot"
                style={{ transform: `rotateY(${i * angle}deg) translateZ(${radius}px)` }}
              >
                <a
                  className="ring__face"
                  ref={(el) => {
                    faceEls.current[i] = el;
                  }}
                  href={item.href}
                  onFocus={() => {
                    // keyboard: turn the ring so the focused frame faces forward
                    const turns = Math.round((rotYRef.current + i * angle) / 360);
                    rotYRef.current = -(i * angle) + 360 * turns;
                    velRef.current = 0;
                  }}
                  aria-label={`Open ${item.title}`}
                  aria-hidden={isCopy || undefined}
                  tabIndex={isCopy ? -1 : 0}
                  draggable={false}
                  onClick={(e) => {
                    if (suppressClick.current) e.preventDefault();
                  }}
                  onDragStart={(e) => e.preventDefault()}
                >
                  <Face item={item} cornerRadius={cornerRadius} />
                  <span className="ring__label">{item.title}</span>
                </a>
                <div
                  className="ring__back"
                  aria-hidden="true"
                  style={{ borderRadius: cornerRadius, filter: `brightness(${innerDim / 10})` }}
                >
                  <Face item={item} back cornerRadius={cornerRadius} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
