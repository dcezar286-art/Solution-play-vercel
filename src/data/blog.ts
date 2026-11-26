import { getCollection, type CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"blog">;

let cache: Promise<Post[]> | undefined;

/** Posts publicados, do mais novo para o mais antigo. Rascunhos só aparecem no localhost. */
export function getPublishedPosts(): Promise<Post[]> {
  // Uma leitura por build (no localhost relê sempre, para o post novo aparecer na hora).
  if (cache && !import.meta.env.DEV) return cache;
  cache = getCollection("blog", ({ data }) => import.meta.env.DEV || !data.draft).then((posts) =>
    posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()),
  );
  return cache;
}

export const postUrl = (post: Post) => `/blog/${post.id}/`;

export const formatDate = (date: Date) =>
  date.toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
