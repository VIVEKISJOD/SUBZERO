import { useEffect, useRef, useState } from "react";
import type { Project } from "./projects";
import { assetUrl, isYouTube, youTubeEmbed } from "./lib";

/**
 * The complete-story viewer. Only mounted after the visitor clicks
 * "Play Complete Story". Esc or the Close button leaves it; focus is kept
 * inside while it's open and returned to the button afterwards.
 */
export default function Player({ project, onClose }: { project: Project; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const hasVideo = !!project.fullVideo;
  const youtube = hasVideo && isYouTube(project.fullVideo);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const scrollY = window.scrollY;
    document.documentElement.classList.add("lock");
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && dialogRef.current) {
        const f = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>("button, video, iframe, a[href], [tabindex]:not([tabindex='-1'])"),
        );
        if (f.length === 0) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("lock");
      window.scrollTo(0, scrollY);
      previous?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      className="player"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} — complete story`}
      ref={dialogRef}
    >
      <div className="player__bar">
        <p className="player__title">
          <span className="eyebrow">Complete story</span>
          {project.title}
        </p>
        <button ref={closeRef} className="btn btn--secondary player__close" onClick={onClose}>
          Close
        </button>
      </div>

      <div className="player__stage">
        {!hasVideo || failed ? (
          <div className="player__missing">
            <p className="eyebrow">Not available yet</p>
            <p className="player__missing-title">
              {hasVideo ? "This video could not be loaded." : "The complete story has not been added yet."}
            </p>
            <p className="muted">
              {hasVideo
                ? `Check that the file or link “${project.fullVideo}” exists and is spelled exactly the same in projects.ts.`
                : "Set fullVideo for this project in projects.ts (a file name or a video link)."}
            </p>
          </div>
        ) : youtube ? (
          <iframe
            className="player__video"
            src={youTubeEmbed(project.fullVideo)}
            title={`${project.title} — complete story`}
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            className="player__video"
            src={assetUrl(project.fullVideo)}
            controls
            autoPlay
            playsInline
            preload="auto"
            onError={() => setFailed(true)}
          >
            Your browser can't play this video.
          </video>
        )}
      </div>
    </div>
  );
}
