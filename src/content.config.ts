/**
 * Coleção do blog. Cada post é um arquivo .md em src/content/blog/.
 * Arquivos que começam com "_" (como _modelo.md) são ignorados.
 */
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/blog" }),
  schema: z.object({
    /** Título do post (aparece no Google). Ideal: 50 a 60 caracteres. */
    title: z.string(),
    /** Resumo do post (aparece no Google). Ideal: 140 a 160 caracteres. */
    description: z.string(),
    /** Data de publicação. Ex.: 2026-12-01 */
    pubDate: z.coerce.date(),
    /** Data da última revisão, se houver. */
    updatedDate: z.coerce.date().optional(),
    /** Serviço relacionado: mostra o atalho para a página certa no fim do post. */
    service: z.enum(["ti", "seguranca", "noc", "dev"]).optional(),
    /** Imagem de capa em /public/blog/ (opcional). Ex.: "/blog/capa.jpg" */
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    /** true = não publica (só aparece no localhost). */
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
