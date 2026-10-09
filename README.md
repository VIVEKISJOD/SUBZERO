# Animation portfolio website

A cinematic multipage portfolio for AI-made animations. Free to host on GitHub Pages.

## What is where

All files sit in the main folder of the repository (no sub-folders to manage).

| File | What it is | Do you edit it? |
|---|---|---|
| `projects.ts` | Your animations: titles, text, file names, video links | YES |
| `site.ts` | Studio name, headline, About text, email, social links | YES |
| your pictures and videos (`.jpg .png .webp .mp4 .webm`) | Uploaded next to the other files | YES (upload) |
| `styles.css` | Colours and look | Rarely |
| everything else (`.tsx`, `index.html`, `vite.config.ts`, `package.json`, `tsconfig.json`) | The website's engine | No |
| `deploy.yml` | Copy of the publish recipe (see step 4 of the setup) | Only used once |

## Pictures and videos: what to name them

Upload each file into the main folder, then write the exact file name in `projects.ts`.
The sample names are already in `projects.ts`:

- `film01-thumb.jpg` — thumbnail, square-ish (about 800 x 800). Used on the 3D ring and lists.
- `film01-hero.jpg` — tall or wide poster (about 1200 x 1600). Used in the hero and on the project page.
- `film01-frame1.jpg`, `film01-frame2.jpg` … — still frames from the film (about 1600 x 1000).
- `film01-teaser.mp4` — silent teaser, 10-20 seconds, small file.
- `film01-full.mp4` — the complete film (MP4 / H.264).

Names must match exactly, including capital letters. A missing file shows a labelled grey
placeholder, so you always know what is still needed.

**Big films:** GitHub's website refuses single files over 25 MB. For long films, upload to
YouTube (unlisted is fine) or any host that gives a direct `.mp4` link, then paste the link
in `fullVideo`, e.g. `fullVideo: "https://www.youtube.com/watch?v=XXXXXXXXXXX"`.
Both YouTube links and direct video links work. (YouTube is a third-party service; it is free.)

## Adding another animation

Open `projects.ts`, copy one whole `{ ... },` block, paste it below the last one, and change
the words. The page for it appears by itself. `slug` must be unique, lowercase, with dashes.
Only ONE project should have `featured: true` — that is the film told on the homepage.

## Changing contact and social links

Open `site.ts`. Put your email in `email: ""` and full links in each `url: ""`.
Anything left empty is hidden or shown as "not added yet". Nothing is invented.

## How the pages work

Pages use addresses like `yoursite.github.io/repo/#/animations`. The `#` is intentional: it
makes every page work on GitHub Pages with no extra settings.

## Technology (all free)

React (page building), Vite (builds the site), Fontsource (fonts bundled, no Google request),
TypeScript. No database, no server, no login, no paid service. The homepage 3D ring is the
supplied Round Carousel component, adapted (clickable, keyboard and touch friendly,
reduced-motion aware).

## What is not included on purpose

No contact form: GitHub Pages has no server to receive messages, so a form would only pretend
to work. The Contact page uses your email and social links instead.
