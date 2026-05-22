type SlideVideoId = "hero" | "services" | "commercial";

function syncSlideVideos() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const activeSlide = document.documentElement.getAttribute("data-spa-slide");

  document.querySelectorAll<HTMLElement>("[data-slide-video-backdrop]").forEach((root) => {
    const slide = root.dataset.slideVideoBackdrop as SlideVideoId | undefined;
    const video = root.querySelector<HTMLVideoElement>("[data-slide-video]");
    if (!slide || !video) return;

    const shouldPlay = !reducedMotion.matches && activeSlide === slide;

    if (!shouldPlay) {
      video.pause();
      return;
    }

    if (video.preload === "none" && !video.dataset.loaded) {
      video.preload = "auto";
      video.load();
      video.dataset.loaded = "true";
    }

    void video.play().catch(() => undefined);
  });
}

let wired = false;

export function initSlideVideoBackdrops() {
  if (wired) return;
  wired = true;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  reducedMotion.addEventListener("change", syncSlideVideos);
  document.addEventListener("astro:page-load", syncSlideVideos);
  new MutationObserver(syncSlideVideos).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-spa-slide"],
  });
  syncSlideVideos();
}

void initSlideVideoBackdrops();
