import { useState } from "react";
import { site } from "./site";
import { projects, featuredProject as feat } from "./projects";
import { Link } from "./router";
import { Picture, Teaser } from "./Media";
import RoundCarousel from "./RoundCarousel";
import PlayButton from "./PlayButton";
import { Reveal, useMediaQuery, usePageMeta, useReducedMotion, useSectionProgress } from "./lib";

/* ───────── Scene A — opening ───────── */
function Hero() {
  const lines = site.hero.headline.split("\n");
  return (
    <section className="hero">
      <div className="hero__text">
        <p className="eyebrow">{site.tagline}</p>
        <h1 className="display hero__title">
          {lines.map((l, i) => (
            <span key={i} className="hero__line">
              <span style={{ animationDelay: `${150 + i * 140}ms` }}>{l}</span>
            </span>
          ))}
        </h1>
        <p className="lead hero__intro">{site.hero.intro}</p>
      </div>

      <figure className="hero__frame frame frame--tall">
        <Teaser video={feat.teaserVideo} poster={feat.heroImage} alt={`Teaser for ${feat.title}`} eager />
        <figcaption className="hero__caption">
          <span className="eyebrow">Now showing</span>
          <Link to={`/animations/${feat.slug}`}>{feat.title}</Link>
        </figcaption>
      </figure>

      <a className="scrollcue" href="#/" onClick={(e) => { e.preventDefault(); document.getElementById("story")?.scrollIntoView({ behavior: "smooth" }); }}>
        <span className="scrollcue__line" aria-hidden="true" />
        Scroll
      </a>
    </section>
  );
}

/* ───────── Scene B — the story unfolds ───────── */
function Story() {
  const reduced = useReducedMotion();
  const fragments = feat.storyFragments.length ? feat.storyFragments : ["Add storyFragments in projects.ts."];
  const n = fragments.length;
  const frames = feat.galleryImages.length ? feat.galleryImages : [feat.heroImage];
  const [active, setActive] = useState(0);

  const ref = useSectionProgress<HTMLElement>(reduced, (p) => {
    // the first 18% of the scroll is the frame opening up; fragments share the rest
    const t = Math.max(0, (p - 0.18) / 0.82);
    const i = Math.min(n - 1, Math.floor(t * n));
    setActive((cur) => (cur === i ? cur : i));
  });

  if (reduced) {
    // No sticky animation: simple stacked frames and lines.
    return (
      <section className="story story--static" id="story" ref={ref}>
        {fragments.map((f, i) => (
          <div className="story__static-item" key={i}>
            <figure className="frame frame--wide">
              <Picture file={frames[i % frames.length]} alt="" />
            </figure>
            <p className="display story__line">{f}</p>
          </div>
        ))}
      </section>
    );
  }

  return (
    <section
      className="story"
      id="story"
      ref={ref}
      aria-label={`A glimpse of ${feat.title}`}
      style={{ height: `${Math.max(3, n + 1) * 85}vh` }}
    >
      <div className="story__sticky">
        <div className="story__frame">
          {frames.map((f, i) => (
            <div
              key={i}
              className={`story__layer ${frames.length === 1 || i === active % frames.length ? "is-on" : ""}`}
            >
              <Picture file={f} alt={i === 0 ? `Still from ${feat.title}` : ""} />
            </div>
          ))}
          <div className="story__scrim" aria-hidden="true" />
        </div>

        {fragments.map((f, i) => (
          <p
            key={i}
            className={`display story__fragment ${i % 2 ? "story__fragment--r" : "story__fragment--l"} ${i === active ? "is-on" : ""}`}
            aria-hidden={i !== active}
          >
            <span className="story__count">
              {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
            </span>
            {f}
          </p>
        ))}
      </div>
    </section>
  );
}

/* ───────── Scene C — the 3D ring ───────── */
function Collection() {
  const phone = useMediaQuery("(max-width: 640px)");
  const items = projects.map((p) => ({ src: p.thumbnail, title: p.title, href: `#/animations/${p.slug}` }));
  return (
    <section className="collection">
      <div className="section-head">
        <Reveal>
          <p className="eyebrow">The collection</p>
        </Reveal>
        <Reveal as="h2" className="display h2">
          Pick a world.
        </Reveal>
        <Reveal as="p" className="muted">
          {phone ? "Swipe sideways, tap to open." : "Drag to turn the ring. Click a frame to open it."}
        </Reveal>
      </div>

      {phone ? (
        <ul className="strip" aria-label="Animations">
          {projects.map((p) => (
            <li key={p.slug}>
              <Link to={`/animations/${p.slug}`} aria-label={`Open ${p.title}`}>
                <div className="frame frame--square">
                  <Picture file={p.thumbnail} alt={p.title} kind="Thumbnail" />
                </div>
                <span className="strip__title">{p.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="ring-stage">
          <RoundCarousel items={items} imageWidth={300} imageHeight={300} tilt={-7} speed={4} spacing={3.5} cornerRadius={14} />
        </div>
      )}
    </section>
  );
}

/* ───────── Scene D — more stories ───────── */
function MoreStories() {
  const rest = projects.filter((p) => p.slug !== feat.slug).slice(0, 3);
  return (
    <section className="more">
      <div className="section-head section-head--left">
        <Reveal>
          <p className="eyebrow">More stories</p>
        </Reveal>
      </div>
      {rest.map((p, i) => (
        <article key={p.slug} className={`more__item more__item--${i % 3}`}>
          <Reveal className="more__media">
            <Link to={`/animations/${p.slug}`} aria-label={`Open ${p.title}`}>
              <div className={`frame ${i % 3 === 1 ? "frame--tall" : "frame--wide"}`}>
                <Picture file={p.thumbnail} alt={p.title} kind="Thumbnail" />
              </div>
            </Link>
          </Reveal>
          <div className="more__text">
            <Reveal delay={80}>
              <p className="eyebrow">
                {[p.category, p.year].filter(Boolean).join(" · ")}
              </p>
            </Reveal>
            <Reveal as="h3" className="display h3" delay={140}>
              {p.title}
            </Reveal>
            <Reveal as="p" className="muted" delay={200}>
              {p.description}
            </Reveal>
            <Reveal delay={260}>
              <Link className="textlink" to={`/animations/${p.slug}`}>
                Explore project
              </Link>
            </Reveal>
          </div>
        </article>
      ))}
      <div className="more__all">
        <Link className="btn btn--secondary" to="/animations">
          All animations
        </Link>
      </div>
    </section>
  );
}

/* ───────── Scene E — complete story ───────── */
function CompleteStory() {
  return (
    <section className="complete">
      <Reveal>
        <p className="eyebrow">The complete story</p>
      </Reveal>
      <Reveal as="h2" className="display h1 complete__title">
        {feat.title}
      </Reveal>
      <Reveal as="p" className="lead">
        You have seen a glimpse. The full film plays only when you ask for it.
      </Reveal>
      <Reveal className="complete__actions">
        <PlayButton project={feat} />
        <Link className="btn btn--secondary" to={`/animations/${feat.slug}`}>
          Project page
        </Link>
      </Reveal>
      {!feat.fullVideo && (
        <p className="muted small complete__note">
          Placeholder: no complete video has been set for this project yet (fullVideo in projects.ts).
        </p>
      )}
    </section>
  );
}

/* ───────── Scene F — studio ───────── */
function Studio() {
  return (
    <section className="studio">
      <Reveal as="h2" className="display h2">
        {site.studioName}
      </Reveal>
      <Reveal as="p" className="lead">
        {site.about.paragraphs[0]}
      </Reveal>
      <Reveal className="studio__links">
        <Link className="textlink" to="/animations">
          All animations
        </Link>
        <Link className="textlink" to="/about">
          About the studio
        </Link>
        <Link className="textlink" to="/contact">
          Contact
        </Link>
      </Reveal>
    </section>
  );
}

export default function Home() {
  usePageMeta(`${site.studioName} — ${site.tagline}`, site.description);
  return (
    <>
      <Hero />
      <Story />
      <Collection />
      <MoreStories />
      <CompleteStory />
      <Studio />
    </>
  );
}
