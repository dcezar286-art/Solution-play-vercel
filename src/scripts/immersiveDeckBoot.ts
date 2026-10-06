import { syncMenuCursor } from "./interactiveMenuBoot";

declare global {
  interface Window {
    __solutionPlayGoToChapter?: (targetId: string) => void;
    __solutionPlayDeckBooted?: boolean;
  }
}

const CHAPTER_IDS = ["brand", "services", "trust", "pricing", "contact"] as const;
type ChapterId = (typeof CHAPTER_IDS)[number];

const immersiveMedia = window.matchMedia("(min-width: 641px)");
let activeChapter: ChapterId = "brand";
let transitionTimer: number | null = null;

function isChapterId(value: string | undefined | null): value is ChapterId {
  return Boolean(value && CHAPTER_IDS.includes(value as ChapterId));
}

function getChapterIndex(chapter: ChapterId) {
  return CHAPTER_IDS.indexOf(chapter);
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(target.closest("input, textarea, select, [contenteditable='true']"));
}

function isImmersiveMode() {
  return immersiveMedia.matches;
}

function syncMenu(target: ChapterId) {
  document.querySelectorAll<HTMLElement>("[data-chapter-jump]").forEach((trigger) => {
    const isActive = trigger.dataset.chapterJump === target;
    trigger.classList.toggle("active", isActive);
    if (isActive) trigger.setAttribute("aria-current", "page");
    else trigger.removeAttribute("aria-current");
  });

  window.requestAnimationFrame(() => syncMenuCursor(true));
}

function syncSceneAccessibility(target: ChapterId) {
  document.querySelectorAll<HTMLElement>("[data-chapter]").forEach((scene) => {
    const isActive = scene.dataset.chapter === target;
    scene.setAttribute("aria-hidden", String(isImmersiveMode() && !isActive));
    scene.inert = isImmersiveMode() && !isActive;
  });
}

function getScrollableSceneSurface(target: EventTarget | null) {
  if (!(target instanceof Element)) return null;
  return target.closest<HTMLElement>(".cinematic-chapter__inner");
}

function canSurfaceConsumeWheel(surface: HTMLElement | null, deltaY: number) {
  if (!surface || surface.scrollHeight <= surface.clientHeight + 4) return false;

  const movingDown = deltaY > 0;
  const atTop = surface.scrollTop <= 2;
  const atBottom = surface.scrollTop + surface.clientHeight >= surface.scrollHeight - 2;

  return (movingDown && !atBottom) || (!movingDown && !atTop);
}

function focusDeck() {
  const main = document.querySelector<HTMLElement>(".cinematic-main");
  if (!main) return;
  if (!main.hasAttribute("tabindex")) main.setAttribute("tabindex", "-1");
  main.focus({ preventScroll: true });
}

function settleScene(chapter: ChapterId) {
  const scene = document.querySelector<HTMLElement>(`[data-chapter="${chapter}"]`);
  if (!scene) return;

  scene.style.transform = "none";
  scene.style.opacity = "1";
  scene.style.filter = "none";

  scene.querySelectorAll<HTMLElement>("[data-motion-card]").forEach((card) => {
    card.style.transform = "none";
    card.style.opacity = "1";
    card.style.filter = "none";
    card.style.setProperty("--card-x", "0px");
    card.style.setProperty("--card-y", "0px");
    card.style.setProperty("--card-rx", "0deg");
    card.style.setProperty("--card-ry", "0deg");
  });
}

function prepareScene(chapter: ChapterId) {
  const scene = document.querySelector<HTMLElement>(`[data-chapter="${chapter}"]`);
  if (!scene) return;

  scene.style.removeProperty("transform");
  scene.style.removeProperty("opacity");
  scene.style.removeProperty("filter");
  scene.querySelectorAll<HTMLElement>("[data-motion-card]").forEach((card) => {
    card.style.removeProperty("transform");
    card.style.removeProperty("opacity");
    card.style.removeProperty("filter");
    card.style.removeProperty("--card-x");
    card.style.removeProperty("--card-y");
    card.style.removeProperty("--card-rx");
    card.style.removeProperty("--card-ry");
  });
}

function activateChapter(target: ChapterId) {
  if (transitionTimer !== null) {
    window.clearTimeout(transitionTimer);
    transitionTimer = null;
    settleScene(activeChapter);
  }

  const previous = activeChapter;
  const previousIndex = getChapterIndex(previous);

  if (target === previous) {
    document.documentElement.dataset.activeChapter = target;
    document.documentElement.dataset.sceneIndex = String(getChapterIndex(target));
    settleScene(target);
    syncSceneAccessibility(target);
    syncMenu(target);
    if (!isImmersiveMode()) {
      document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    return;
  }

  prepareScene(target);
  activeChapter = target;
  const index = getChapterIndex(target);

  document.documentElement.dataset.previousChapter = previous;
  document.documentElement.dataset.activeChapter = target;
  document.documentElement.dataset.sceneIndex = String(index);
  document.documentElement.dataset.transitionDirection =
    index >= previousIndex ? "forward" : "backward";
  document.documentElement.dataset.transitionState = "entering";
  document.documentElement.style.setProperty("--chapter-progress", "0");
  document.documentElement.style.setProperty("--scene-index", String(index));
  syncSceneAccessibility(target);
  document.dispatchEvent(new CustomEvent("solutionplay:chapter-change", { detail: { chapter: target } }));
  syncMenu(target);

  transitionTimer = window.setTimeout(() => {
    transitionTimer = null;
    settleScene(target);
    if (document.documentElement.dataset.activeChapter === target) {
      document.documentElement.dataset.transitionState = "settled";
    }
  }, 980);

  document.querySelectorAll<HTMLElement>(".cinematic-chapter__inner").forEach((surface) => {
    if (surface.closest<HTMLElement>(".cinematic-chapter")?.dataset.chapter === target) {
      surface.scrollTo({ top: 0, behavior: "auto" });
    }
  });

  if (isImmersiveMode()) {
    if (window.scrollY !== 0) window.scrollTo({ top: 0, behavior: "auto" });
    focusDeck();
    return;
  }

  document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function stepChapter(direction: 1 | -1) {
  const currentIndex = getChapterIndex(activeChapter);
  const nextIndex =
    direction > 0
      ? Math.min(currentIndex + 1, CHAPTER_IDS.length - 1)
      : Math.max(currentIndex - 1, 0);

  activateChapter(CHAPTER_IDS[nextIndex]);
}

function handleJumpIntent(event: MouseEvent | PointerEvent) {
  const trigger = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-chapter-jump]") : null;
  const target = trigger?.dataset.chapterJump;
  if (!isChapterId(target)) return;

  event.preventDefault();
  event.stopPropagation();
  activateChapter(target);
}

function handleKeyboardNavigation(event: KeyboardEvent) {
  if (!isImmersiveMode() || event.defaultPrevented) return;
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  if (isEditableTarget(event.target)) return;
  if (event.target instanceof Element && event.target.closest("button, a") && event.key === " ") return;
  if (transitionTimer !== null) return;

  if (event.key === "ArrowDown" || event.key === "Down" || event.key === "PageDown" || event.key === " ") {
    event.preventDefault();
    event.stopPropagation();
    stepChapter(1);
  }

  if (event.key === "ArrowUp" || event.key === "Up" || event.key === "PageUp") {
    event.preventDefault();
    event.stopPropagation();
    stepChapter(-1);
  }
}

function handleWheelNavigation(event: WheelEvent) {
  if (!isImmersiveMode()) return;
  if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
  if (canSurfaceConsumeWheel(getScrollableSceneSurface(event.target), event.deltaY)) return;

  event.preventDefault();
  event.stopPropagation();

  if (transitionTimer !== null) return;
  if (Math.abs(event.deltaY) < 16) return;

  stepChapter(event.deltaY > 0 ? 1 : -1);
}

function handleHashNavigation() {
  const hashTarget = window.location.hash.replace("#", "");
  if (isChapterId(hashTarget)) activateChapter(hashTarget);
}

function syncResponsiveMode() {
  if (isImmersiveMode()) {
    activateChapter(activeChapter);
    return;
  }

  const visibleChapter = [...document.querySelectorAll<HTMLElement>("[data-chapter]")]
    .map((chapter) => ({
      id: chapter.dataset.chapter,
      distance: Math.abs(chapter.getBoundingClientRect().top - window.innerHeight * 0.24),
    }))
    .sort((a, b) => a.distance - b.distance)[0]?.id;

  if (isChapterId(visibleChapter)) activateChapter(visibleChapter);
}

window.__solutionPlayDeckBooted = true;
window.__solutionPlayGoToChapter = (targetId: string) => {
  if (isChapterId(targetId)) activateChapter(targetId);
};

document.addEventListener("click", handleJumpIntent, { capture: true });
window.addEventListener("keydown", handleKeyboardNavigation, { capture: true });
window.addEventListener("wheel", handleWheelNavigation, { capture: true, passive: false });
window.addEventListener("hashchange", handleHashNavigation);
immersiveMedia.addEventListener("change", syncResponsiveMode);

// Native scrolling keeps every chapter accessible on touch-sized screens.
let scrollFrame = 0;
window.addEventListener("scroll", () => {
  if (isImmersiveMode() || scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => {
    scrollFrame = 0;
    const scenes = [...document.querySelectorAll<HTMLElement>("[data-chapter]")];
    const current = scenes.find((scene) => {
      const rect = scene.getBoundingClientRect();
      return rect.top <= innerHeight * 0.5 && rect.bottom > innerHeight * 0.5;
    });
    const id = current?.dataset.chapter;
    if (isChapterId(id) && id !== activeChapter) {
      activeChapter = id;
      document.documentElement.dataset.activeChapter = id;
      syncMenu(id);
    }
  });
}, { passive: true });

handleHashNavigation();
if (!isChapterId(document.documentElement.dataset.activeChapter)) activateChapter("brand");
else activateChapter(document.documentElement.dataset.activeChapter);
