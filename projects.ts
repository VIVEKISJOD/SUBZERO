/**
 * PROJECTS — one entry per animation. This is the ONLY place you edit to add,
 * remove or change an animation. Pages are created automatically.
 *
 * FILES: upload your pictures / videos into the main folder of the GitHub
 * repository (next to this file) and write the file NAME here, e.g.
 *   thumbnail: "ember-gate-thumb.jpg"
 * A file name that does not exist simply shows a labelled placeholder.
 *
 * HOSTED VIDEO: for big films, paste a web link instead of a file name.
 *   fullVideo: "https://example.com/my-film.mp4"      (direct mp4 link)
 *   fullVideo: "https://www.youtube.com/watch?v=XXXX" (YouTube link works too)
 *
 * Leave a text field "" or a list [] if you don't have it yet.
 */
export interface Project {
  slug: string; // web address part, lowercase-with-dashes, must be unique
  title: string;
  description: string; // short synopsis (1-3 sentences)
  category: string; // used for the filters on the All Animations page
  year: string;
  featured?: boolean; // true = this is the story told on the homepage (use on ONE project)
  thumbnail: string; // square-ish picture for the 3D ring and lists
  heroImage: string; // wide picture for the top of the project page
  teaserVideo: string; // short silent teaser (10-20 s) shown on the homepage
  fullVideo: string; // the complete animation; only plays after "Play Complete Story"
  storyFragments: string[]; // short lines revealed while scrolling the homepage
  galleryImages: string[]; // still frames from the film
  notes?: string; // optional production / AI workflow notes
}

export const projects: Project[] = [
  {
    slug: "untitled-one",
    title: "Untitled Film 01",
    description:
      "Placeholder synopsis. Replace this with one to three sentences about the film. Keep it short; let the pictures talk.",
    category: "Mystery",
    year: "2026",
    featured: true,
    thumbnail: "film01-thumb.jpg",
    heroImage: "film01-hero.jpg",
    teaserVideo: "film01-teaser.mp4",
    fullVideo: "film01-full.mp4",
    storyFragments: [
      "A strange location.",
      "Someone is already standing there.",
      "An object that should not be here.",
      "“Did you hear that?”",
      "Press play to see what happens next.",
    ],
    galleryImages: ["film01-frame1.jpg", "film01-frame2.jpg", "film01-frame3.jpg", "film01-frame4.jpg"],
    notes: "Placeholder: tools used, how long it took, what you learned. Delete this line to hide the section.",
  },
  {
    slug: "untitled-two",
    title: "Untitled Film 02",
    description: "Placeholder synopsis for your second animation.",
    category: "Dream",
    year: "2026",
    thumbnail: "film02-thumb.jpg",
    heroImage: "film02-hero.jpg",
    teaserVideo: "film02-teaser.mp4",
    fullVideo: "",
    storyFragments: [],
    galleryImages: ["film02-frame1.jpg", "film02-frame2.jpg"],
  },
  {
    slug: "untitled-three",
    title: "Untitled Film 03",
    description: "Placeholder synopsis for your third animation.",
    category: "Fantasy",
    year: "2026",
    thumbnail: "film03-thumb.jpg",
    heroImage: "film03-hero.jpg",
    teaserVideo: "",
    fullVideo: "",
    storyFragments: [],
    galleryImages: [],
  },
  {
    slug: "untitled-four",
    title: "Untitled Film 04",
    description: "Placeholder synopsis for your fourth animation.",
    category: "Mystery",
    year: "2025",
    thumbnail: "film04-thumb.jpg",
    heroImage: "film04-hero.jpg",
    teaserVideo: "",
    fullVideo: "",
    storyFragments: [],
    galleryImages: [],
  },
  {
    slug: "untitled-five",
    title: "Untitled Film 05",
    description: "Placeholder synopsis for your fifth animation.",
    category: "Dream",
    year: "2025",
    thumbnail: "film05-thumb.jpg",
    heroImage: "film05-hero.jpg",
    teaserVideo: "",
    fullVideo: "",
    storyFragments: [],
    galleryImages: [],
  },
  {
    slug: "untitled-six",
    title: "Untitled Film 06",
    description: "Placeholder synopsis for your sixth animation.",
    category: "Fantasy",
    year: "2025",
    thumbnail: "film06-thumb.jpg",
    heroImage: "film06-hero.jpg",
    teaserVideo: "",
    fullVideo: "",
    storyFragments: [],
    galleryImages: [],
  },
];

export const featuredProject: Project = projects.find((p) => p.featured) ?? projects[0];
