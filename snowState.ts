/**
 * A tiny shared "snow speed" switch. Anything can call these:
 *  - boostSnow(ms)     : snow rushes for a short time (opening an animation)
 *  - snowLoading(true) : snow keeps rushing until you call snowLoading(false)
 *                        (while the complete story's video is still loading)
 */
let boostUntil = 0;
let loading = 0;

export function boostSnow(ms = 2000) {
  boostUntil = Math.max(boostUntil, performance.now() + ms);
}

export function snowLoading(on: boolean) {
  loading = Math.max(0, loading + (on ? 1 : -1));
}

/** 1 = calm fall, higher = rushing. Read by the snow canvas every frame. */
export function snowTarget(now: number): number {
  return loading > 0 || now < boostUntil ? 7 : 1;
}
