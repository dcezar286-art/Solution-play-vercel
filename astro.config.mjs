import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

import tailwindcss from "@tailwindcss/vite";

const SITE = "https://www.solutionplay.com.br";

// URLs que nunca devem entrar no sitemap (comparação exata, para não bloquear páginas futuras).
const SITEMAP_EXCLUDE = new Set([`${SITE}/servicos`, `${SITE}/servicos/`]);

export default defineConfig({
  site: SITE,
  integrations: [
    sitemap({
      filter: (page) => !SITEMAP_EXCLUDE.has(page),
      changefreq: "monthly",
      lastmod: new Date(),
    }),
  ],
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