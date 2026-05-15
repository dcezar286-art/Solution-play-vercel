function initScenes() {
  const sections = document.querySelectorAll(".snap-section");
  if (!sections.length) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    sections.forEach((s) => s.classList.add("is-scene-active"));
    return;
  }

  const first = sections[0];
  first?.classList.add("is-scene-active");

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting && e.intersectionRatio >= 0.32) {
          e.target.classList.add("is-scene-active");
        }
      }
    },
    { threshold: [0, 0.2, 0.32, 0.45, 0.6] }
  );

  sections.forEach((s) => io.observe(s));
}

initScenes();
document.addEventListener("astro:page-load", initScenes);
