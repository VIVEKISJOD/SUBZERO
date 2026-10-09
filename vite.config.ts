import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";

/**
 * Your own pictures and videos live next to the code files (in the repo's
 * main folder). This plugin copies them into the finished website.
 * Any file ending in .jpg .jpeg .png .webp .avif .gif .mp4 .webm .mov
 * is picked up automatically. (favicon.svg is handled separately.)
 */
function copyRootMedia(): Plugin {
  const MEDIA = /\.(jpe?g|png|webp|avif|gif|mp4|webm|mov)$/i;
  return {
    name: "copy-root-media",
    apply: "build",
    closeBundle() {
      const root = process.cwd();
      const out = path.resolve(root, "dist");
      for (const f of fs.readdirSync(root)) {
        if (MEDIA.test(f) && fs.statSync(path.join(root, f)).isFile()) {
          fs.copyFileSync(path.join(root, f), path.join(out, f));
        }
      }
    },
  };
}

/** In `npm run dev` the media files are served straight from the root. */
export default defineConfig({
  base: "./", // works on username.github.io/repo-name/ and on any other host
  publicDir: false,
  plugins: [react(), copyRootMedia()],
  build: {
    outDir: "dist",
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        // Keep the built site flat: no sub-folders.
        entryFileNames: "app-[hash].js",
        chunkFileNames: "chunk-[hash].js",
        assetFileNames: "[name]-[hash][extname]",
      },
    },
  },
});
