export type SpaSlideId = "hero" | "services" | "commercial" | "contact";

const SLIDE_EVENT = "spa:slide-change";

export function emitSpaSlideChange(slideId: SpaSlideId) {
  document.dispatchEvent(new CustomEvent(SLIDE_EVENT, { detail: { slideId } }));
}

export function onSpaSlideChange(handler: (slideId: SpaSlideId) => void) {
  const listener = (e: Event) => {
    const detail = (e as CustomEvent<{ slideId: SpaSlideId }>).detail;
    if (detail?.slideId) handler(detail.slideId);
  };
  document.addEventListener(SLIDE_EVENT, listener);
  return () => document.removeEventListener(SLIDE_EVENT, listener);
}

export function getActiveSpaSlide(): SpaSlideId {
  return (document.documentElement.dataset.spaSlide as SpaSlideId) || "hero";
}
