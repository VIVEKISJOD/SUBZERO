import { useEffect, useRef, useState } from "react";
import { assetUrl, useOnScreen, useReducedMotion } from "./lib";

/** Clearly labelled box shown when a picture or video file is missing. */
export function Placeholder({ file, kind = "Image" }: { file?: string; kind?: string }) {
  return (
    <div className="placeholder" role="img" aria-label={`${kind} placeholder`}>
      <span className="placeholder__kind">{kind} placeholder</span>
      <span className="placeholder__file">{file ? file : "no file set"}</span>
      <span className="placeholder__hint">Upload this file to your GitHub repository</span>
    </div>
  );
}

/** A picture that falls back to a placeholder if the file is missing. */
export function Picture({
  file,
  alt,
  eager = false,
  className = "",
  kind = "Image",
}: {
  file: string;
  alt: string;
  eager?: boolean;
  className?: string;
  kind?: string;
}) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [file]);
  if (!file || failed) return <Placeholder file={file} kind={kind} />;
  return (
    <img
      className={className}
      src={assetUrl(file)}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      draggable={false}
      onError={() => setFailed(true)}
    />
  );
}

/**
 * Silent looping teaser. Plays only while on screen, never with sound,
 * and not at all if the visitor prefers reduced motion (poster shows instead).
 */
export function Teaser({
  video,
  poster,
  alt,
  eager = false,
}: {
  video: string;
  poster: string;
  alt: string;
  eager?: boolean;
}) {
  const reduced = useReducedMotion();
  const [failed, setFailed] = useState(false);
  const [wrap, onScreen] = useOnScreen<HTMLDivElement>();
  const vref = useRef<HTMLVideoElement>(null);

  useEffect(() => setFailed(false), [video]);

  useEffect(() => {
    const v = vref.current;
    if (!v) return;
    if (onScreen && !reduced) v.play().catch(() => {});
    else v.pause();
  }, [onScreen, reduced, video]);

  const showVideo = video && !failed && !reduced;
  return (
    <div ref={wrap} className="teaser">
      {/* picture underneath: poster, or the placeholder if nothing exists */}
      <Picture file={poster} alt={alt} eager={eager} />
      {showVideo && (
        <video
          ref={vref}
          className="teaser__video"
          src={assetUrl(video)}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={`${alt} (silent teaser)`}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
