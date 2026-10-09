import { useEffect, useState, type AnchorHTMLAttributes, type ReactNode } from "react";

/**
 * A tiny router built on the web address "#". Every page is a real address
 * (…/#/animations, …/#/about) so links, the back button and bookmarks work,
 * and it works on GitHub Pages with no extra settings.
 */
export function currentPath(): string {
  const raw = window.location.hash.replace(/^#/, "");
  const path = raw.split("?")[0] || "/";
  return path.startsWith("/") ? path : "/" + path;
}

export function usePath(): string {
  const [path, setPath] = useState(currentPath);
  useEffect(() => {
    const on = () => setPath(currentPath());
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return path;
}

export function Link({
  to,
  children,
  ...rest
}: { to: string; children: ReactNode } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  return (
    <a href={`#${to}`} {...rest}>
      {children}
    </a>
  );
}

export function navigate(to: string) {
  window.location.hash = to;
}
