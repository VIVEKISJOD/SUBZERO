import { useEffect, useState } from "react";
import { site } from "./site";
import { Link, usePath } from "./router";
import Home from "./Home";
import Backdrop, { boostSnow } from "./Backdrop";
import { About, Animations, Contact, ProjectPage } from "./Pages";

const NAV = [
  { to: "/animations", label: "Animations" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

function Header({ path }: { path: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    document.documentElement.classList.toggle("lock-nav", open);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="nav">
      <Link to="/" className="nav__brand" aria-label={`${site.studioName} — home`}>
        <span className="nav__dot" aria-hidden="true" />
        {site.studioName}
      </Link>
      <button
        className="nav__toggle"
        aria-expanded={open}
        aria-controls="menu"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? "Close" : "Menu"}
      </button>
      <nav id="menu" className={`nav__links ${open ? "is-open" : ""}`} aria-label="Main">
        {NAV.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            aria-current={path === n.to || path.startsWith(n.to + "/") ? "page" : undefined}
          >
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

function Footer() {
  const links = site.contact.social.filter((s) => s.url);
  return (
    <footer className="footer">
      <div className="footer__row">
        <p className="footer__name">{site.studioName}</p>
        <nav className="footer__nav" aria-label="Footer">
          <Link to="/animations">Animations</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          {site.contact.email && <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>}
          {links.map((s) => (
            <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer">
              {s.label}
            </a>
          ))}
        </nav>
      </div>
      <p className="small muted">
        © {new Date().getFullYear()} {site.studioName}. All animations are the work of the studio.
      </p>
    </footer>
  );
}

export default function App() {
  const path = usePath();

  // every page change starts at the top
  useEffect(() => {
    window.scrollTo(0, 0);
    // opening an animation: the snow rushes for a moment, like something loading
    if (/^\/animations\/[^/]+/.test(path)) boostSnow(1800);
  }, [path]);

  let page;
  const m = path.match(/^\/animations\/([^/]+)\/?$/);
  if (path === "/" || path === "") page = <Home />;
  else if (path.replace(/\/$/, "") === "/animations") page = <Animations />;
  else if (m) page = <ProjectPage slug={decodeURIComponent(m[1])} />;
  else if (path.replace(/\/$/, "") === "/about") page = <About />;
  else if (path.replace(/\/$/, "") === "/contact") page = <Contact />;
  else
    page = (
      <section className="page">
        <p className="eyebrow">404</p>
        <h1 className="display h1">Nothing here.</h1>
        <Link className="btn btn--secondary" to="/">
          Back to the start
        </Link>
      </section>
    );

  return (
    <>
      <Backdrop />
      <a className="skip" href="#main" onClick={(e) => { e.preventDefault(); document.getElementById("main")?.focus(); }}>
        Skip to content
      </a>
      <Header path={path} />
      <main id="main" tabIndex={-1} key={path} className="route">
        {page}
      </main>
      <Footer />
    </>
  );
}
