import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://www.solutionplay.com.br",
  integrations: [sitemap()],
  compressHTML: true,
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules/three")) return "three";
            if (id.includes("node_modules/gsap")) return "gsap";
          },
        },
      },
    },

    plugins: [tailwindcss()],
  },
});