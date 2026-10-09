import { useCallback, useState } from "react";
import { createPortal } from "react-dom";
import type { Project } from "./projects";
import Player from "./Player";

/** The "Play Complete Story" button. The full video only loads after a click. */
export default function PlayButton({ project, className = "btn btn--primary" }: { project: Project; className?: string }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  return (
    <>
      <button className={className} onClick={() => setOpen(true)} aria-haspopup="dialog">
        Play Complete Story
      </button>
      {open && createPortal(<Player project={project} onClose={close} />, document.body)}
    </>
  );
}
