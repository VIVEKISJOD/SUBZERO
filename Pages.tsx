import { useState } from "react";
import { site } from "./site";
import { projects, type Project } from "./projects";
import { Link } from "./router";
import { Picture, Teaser } from "./Media";
import PlayButton from "./PlayButton";
import { Reveal, usePageMeta } from "./lib";

/* ───────── All animations ───────── */
export function Animations() {
  usePageMeta(`All animations — ${site.studioName}`, "Every animated world in the collection.");
  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))];
  const [cat, setCat] = useState("All");
  const shown = projects.filter((p) => cat === "All" || p.category === cat);

  return (
    <section className="page archive">
      <header className="page__head">
        <p className="eyebrow">Archive</p>
        <h1 className="display h1">All animations</h1>
      </header>

      {categories.length > 2 && (
        <div className="filters" role="group" aria-label="Filter by category">
          {categories.map((c) => (
            <button
              key={c}
              className={`chip ${c === cat ? "is-active" : ""}`}
              aria-pressed={c === cat}
              onClick={() => setCat(c)}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <div className="archive__grid">
        {shown.map((p, i) => (
          <article key={p.slug} className={`archive__item archive__item--${i % 5}`}>
            <Link to={`/animations/${p.slug}`} aria-label={`Open ${p.title}`} className="archive__link">
              <div className="frame frame--fill">
                <Picture file={p.thumbnail} alt={p.title} kind="Thumbnail" />
              </div>
            </Link>
            <div className="archive__text">
              <p className="eyebrow">{[p.category, p.year].filter(Boolean).join(" · ")}</p>
              <h2 className="display h3">
                <Link to={`/animations/${p.slug}`}>{p.title}</Link>
              </h2>
              <p className="muted">{p.description}</p>
            </div>
          </article>
        ))}
      </div>
      {shown.length === 0 && <p className="muted">Nothing in this category yet.</p>}
    </section>
  );
}

/* ───────── One animation (same template for every project) ───────── */
export function ProjectPage({ slug }: { slug: string }) {
  const p = projects.find((x) => x.slug === slug);
  usePageMeta(
    p ? `${p.title} — ${site.studioName}` : `Not found — ${site.studioName}`,
    p ? p.description : "This animation could not be found.",
  );

  if (!p) {
    return (
      <section className="page">
        <p className="eyebrow">404</p>
        <h1 className="display h1">That animation isn't here.</h1>
        <p className="lead">The address may have a typo, or the project was removed.</p>
        <Link className="btn btn--secondary" to="/animations">
          Back to all animations
        </Link>
      </section>
    );
  }

  const others = projects.filter((x) => x.slug !== p.slug);
  const idx = projects.findIndex((x) => x.slug === p.slug);
  const next = projects[(idx + 1) % projects.length];

  return <ProjectBody p={p} others={others} next={next} />;
}

function ProjectBody({ p, others, next }: { p: Project; others: Project[]; next: Project }) {
  return (
    <article className="page project">
      <Link className="textlink back" to="/animations">
        ← Back to all animations
      </Link>

      <header className="project__head">
        <p className="eyebrow">{[p.category, p.year].filter(Boolean).join(" · ")}</p>
        <h1 className="display h1">{p.title}</h1>
      </header>

      <figure className="frame frame--cinema project__hero">
        <Teaser video={p.teaserVideo} poster={p.heroImage} alt={`${p.title} — still`} eager />
      </figure>

      <div className="project__intro">
        <Reveal as="p" className="lead">
          {p.description}
        </Reveal>
        <Reveal className="project__play">
          <PlayButton project={p} />
          {!p.fullVideo && <p className="muted small">Placeholder: no complete video set for this project yet.</p>}
        </Reveal>
      </div>

      {p.galleryImages.length > 0 && (
        <section className="project__gallery" aria-label="Selected frames">
          <Reveal>
            <p className="eyebrow">Selected frames</p>
          </Reveal>
          <div className="gallery">
            {p.galleryImages.map((g, i) => (
              <Reveal key={g + i} className={`gallery__item gallery__item--${i % 4}`} delay={(i % 2) * 90}>
                <div className="frame frame--fill">
                  <Picture file={g} alt={`${p.title} — frame ${i + 1}`} kind="Frame" />
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {p.notes && (
        <section className="project__notes">
          <Reveal>
            <p className="eyebrow">Production notes</p>
          </Reveal>
          <Reveal as="p" className="lead">
            {p.notes}
          </Reveal>
        </section>
      )}

      <nav className="project__more" aria-label="More projects">
        <p className="eyebrow">Next</p>
        <Link className="display h2 project__next" to={`/animations/${next.slug}`}>
          {next.title} →
        </Link>
        {others.length > 1 && (
          <ul className="project__others">
            {others.slice(0, 5).map((o) => (
              <li key={o.slug}>
                <Link className="textlink" to={`/animations/${o.slug}`}>
                  {o.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </article>
  );
}

/* ───────── About ───────── */
export function About() {
  usePageMeta(`About — ${site.studioName}`, "How the studio makes AI-generated animation.");
  return (
    <section className="page about">
      <header className="page__head">
        <p className="eyebrow">About the studio</p>
        <h1 className="display h1">{site.about.heading}</h1>
      </header>
      <div className="about__body">
        {site.about.paragraphs.map((t, i) => (
          <Reveal as="p" key={i} className={i === 0 ? "lead" : "prose"}>
            {t}
          </Reveal>
        ))}
      </div>
      {site.about.workflow.length > 0 && (
        <ol className="workflow">
          {site.about.workflow.map((w, i) => (
            <Reveal as="li" key={w.title} className="workflow__item" delay={i * 80}>
              <span className="workflow__n">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="display h3">{w.title}</h2>
              <p className="muted">{w.text}</p>
            </Reveal>
          ))}
        </ol>
      )}
    </section>
  );
}

/* ───────── Contact ───────── */
export function Contact() {
  usePageMeta(`Contact — ${site.studioName}`, "Get in touch.");
  const { email, social } = site.contact;
  const links = social.filter((s) => s.url);
  return (
    <section className="page contact">
      <header className="page__head">
        <p className="eyebrow">Contact</p>
        <h1 className="display h1">Say hello.</h1>
      </header>

      <div className="contact__grid">
        <div>
          <p className="eyebrow">Email</p>
          {email ? (
            <a className="display h3 contact__mail" href={`mailto:${email}`}>
              {email}
            </a>
          ) : (
            <p className="muted">Not added yet. Set contact.email in site.ts.</p>
          )}
        </div>
        <div>
          <p className="eyebrow">Elsewhere</p>
          {links.length ? (
            <ul className="contact__social">
              {links.map((s) => (
                <li key={s.label}>
                  <a className="textlink" href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">No social links added yet. Add them in site.ts.</p>
          )}
        </div>
      </div>
    </section>
  );
}
