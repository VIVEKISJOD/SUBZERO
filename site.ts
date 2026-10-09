/**
 * SITE SETTINGS — the one file for your studio name, contact details and
 * social links. Edit the text between the quote marks. Leave a value as ""
 * (empty) to hide it; nothing fake is ever shown.
 */
export const site = {
  studioName: "Studio Name", // <- replace with your studio / channel name
  tagline: "AI-crafted animated worlds",
  description:
    "A cinematic portfolio of AI-crafted animated worlds. Watch a glimpse, then press play for the complete story.",

  hero: {
    // The big words on the first screen. Use \n for a line break.
    headline: "Small worlds,\ntold in motion.",
    intro:
      "A collection of AI-crafted animated worlds. Scroll for a glimpse of each one. Press play when you want the whole story.",
  },

  // CONTACT — fill these in. Empty = shown as "not added yet" on the Contact page only.
  contact: {
    email: "",
    // Social links: full web addresses, e.g. "https://www.instagram.com/yourname"
    social: [
      { label: "Instagram", url: "" },
      { label: "YouTube", url: "" },
      { label: "X / Twitter", url: "" },
    ],
  },

  about: {
    heading: "Slow, strange, atmospheric.",
    paragraphs: [
      "We make short animated films with AI tools, and we treat the tools like a camera crew: they need direction, patience and a point of view.",
      "Every story starts as a mood. A place, a silhouette, an object that shouldn't be there. We build outward from that image until it moves.",
      "This text is a placeholder. Replace it with your own words in site.ts.",
    ],
    // Optional: describe how you actually make your films. Leave [] to hide the section.
    workflow: [
      { title: "Concept", text: "Placeholder: describe how an idea becomes an image." },
      { title: "Generation", text: "Placeholder: list the tools you really use." },
      { title: "Edit and sound", text: "Placeholder: how the film is cut and scored." },
    ],
  },
};
