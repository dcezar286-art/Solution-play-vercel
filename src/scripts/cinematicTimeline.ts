import { syncMenuCursor } from "./interactiveMenuBoot";

declare global {
  interface Window {
    __solutionPlayGoToChapter?: (targetId: string) => void;
  }
}

const CHAPTER_IDS = ["brand", "services", "trust", "pricing", "contact"] as const;
type ChapterId = (typeof CHAPTER_IDS)[number];

let activeChapter: ChapterId = "brand";
let keyboardLocked = false;
let wheelLocked = false;
const immersiveMedia = window.matchMedia("(min-width: 641px)");

function isChapterId(value: string | undefined): value is ChapterId {
  return Boolean(value && CHAPTER_IDS.includes(value as ChapterId));
}

function setActiveMenu(active: ChapterId) {
  document.querySelectorAll<HTMLElement>("[data-chapter-jump]").forEach((button) => {
    const isActive = button.dataset.chapterJump === active;
    button.classList.toggle("active", isActive);
    if (isActive) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
  requestAnimationFrame(() => syncMenuCursor(true));
}

function setActiveChapter(next: ChapterId, progress: number) {
  if (next !== activeChapter) {
    document.documentElement.dataset.previousChapter = activeChapter;
    activeChapter = next;
  }

  const index = CHAPTER_IDS.indexOf(next);
  document.documentElement.dataset.activeChapter = next;
  document.documentElement.dataset.sceneIndex = String(index);
  document.documentElement.style.setProperty("--chapter-progress", progress.toFixed(4));
  document.documentElement.style.setProperty("--scene-index", String(index));
  setActiveMenu(next);
}

function getChapters() {
  return CHAPTER_IDS.map((id) => document.getElementById(id)).filter(
    (chapter): chapter is HTMLElement => chapter instanceof HTMLElement,
  );
}

function isImmersiveMode() {
  return immersiveMedia.matches;
}

function updateChapterState() {
  if (isImmersiveMode()) {
    setActiveChapter(activeChapter, 0);
    if (window.scrollY !== 0) window.scrollTo({ top: 0, behavior: "auto" });
    return;
  }

  const chapters = getChapters();
  if (!chapters.length) return;

  const { next, progress } = getChapterStateFromScroll(chapters);
  setActiveChapter(next, progress);
}

function getChapterStateFromScroll(chapters = getChapters()) {
  const viewportMiddle = window.scrollY + window.innerHeight * 0.46;
  let next: ChapterId = "brand";
  let progress = 0;

  for (const chapter of chapters) {
    const id = chapter.dataset.chapter;
    if (!isChapterId(id)) continue;

    const top = chapter.offsetTop;
    const bottom = top + chapter.offsetHeight;

    if (viewportMiddle >= top && viewportMiddle < bottom) {
      next = id;
      progress = Math.min(Math.max((viewportMiddle - top) / chapter.offsetHeight, 0), 1);
      break;
    }
  }

  return { next, progress };
}

function scrollToChapter(id: ChapterId) {
  const target = document.getElementById(id);
  if (!target) return;
  setActiveChapter(id, 0);
  if (isImmersiveMode()) {
    if (window.scrollY !== 0) window.scrollTo({ top: 0, behavior: "auto" });
    focusCinematicSurface();
    return;
  }
  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function goToChapter(directionOrId: "next" | "prev" | ChapterId) {
  const current = isImmersiveMode() ? activeChapter : getChapterStateFromScroll().next || activeChapter;
  const currentIndex = CHAPTER_IDS.indexOf(current);
  const targetIndex =
    directionOrId === "next"
      ? Math.min(currentIndex + 1, CHAPTER_IDS.length - 1)
      : directionOrId === "prev"
        ? Math.max(currentIndex - 1, 0)
        : CHAPTER_IDS.indexOf(directionOrId);

  const target = CHAPTER_IDS[targetIndex];
  if (target) scrollToChapter(target);
}

window.__solutionPlayGoToChapter = (targetId: string) => {
  if (isChapterId(targetId)) goToChapter(targetId);
};

function handleChapterPointer(event: MouseEvent | PointerEvent) {
  const trigger = (event.target as Element | null)?.closest<HTMLElement>("[data-chapter-jump]");
  if (!trigger) return;

  const targetId = trigger.dataset.chapterJump;
  if (!isChapterId(targetId)) return;

  event.preventDefault();
  event.stopPropagation();
  goToChapter(targetId);
}

function handleHashNavigation() {
  const targetId = window.location.hash.replace("#", "");
  if (isChapterId(targetId)) goToChapter(targetId);
}

document.addEventListener("click", handleChapterPointer, { capture: true });
window.addEventListener("click", handleChapterPointer, { capture: true });
document.addEventListener("pointerdown", handleChapterPointer, { capture: true });
window.addEventListener("pointerdown", handleChapterPointer, { capture: true });
window.addEventListener("hashchange", handleHashNavigation);

function handleKeyboardNavigation(event: KeyboardEvent) {
  if (event.defaultPrevented || keyboardLocked) return;
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;

  if (event.key === "ArrowDown" || event.key === "Down" || event.key === "PageDown") {
    event.preventDefault();
    event.stopPropagation();
    keyboardLocked = true;
    goToChapter("next");
    window.setTimeout(() => {
      keyboardLocked = false;
    }, 950);
  }

  if (event.key === "ArrowUp" || event.key === "Up" || event.key === "PageUp") {
    event.preventDefault();
    event.stopPropagation();
    keyboardLocked = true;
    goToChapter("prev");
    window.setTimeout(() => {
      keyboardLocked = false;
    }, 950);
  }
}

function handleWheelNavigation(event: WheelEvent) {
  if (!isImmersiveMode()) return;

  const scrollSurface =
    event.target instanceof Element ? event.target.closest<HTMLElement>(".cinematic-chapter__inner") : null;
  if (scrollSurface && scrollSurface.scrollHeight > scrollSurface.clientHeight + 4) {
    const movingDown = event.deltaY > 0;
    const atTop = scrollSurface.scrollTop <= 2;
    const atBottom = scrollSurface.scrollTop + scrollSurface.clientHeight >= scrollSurface.scrollHeight - 2;
    if ((movingDown && !atBottom) || (!movingDown && !atTop)) return;
  }

  if (Math.abs(event.deltaY) < 18 || wheelLocked) {
    event.preventDefault();
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  wheelLocked = true;
  goToChapter(event.deltaY > 0 ? "next" : "prev");
  window.setTimeout(() => {
    wheelLocked = false;
  }, 920);
}

function focusCinematicSurface() {
  const main = document.querySelector<HTMLElement>(".cinematic-main");
  if (!main) return;
  if (!main.hasAttribute("tabindex")) main.setAttribute("tabindex", "-1");
  main.focus({ preventScroll: true });
}

window.addEventListener("keydown", handleKeyboardNavigation, { capture: true });
document.addEventListener("keydown", handleKeyboardNavigation, { capture: true });
window.addEventListener("wheel", handleWheelNavigation, { capture: true, passive: false });
window.addEventListener("scroll", updateChapterState, { passive: true });
window.addEventListener("resize", updateChapterState, { passive: true });
immersiveMedia.addEventListener("change", updateChapterState);
window.setTimeout(focusCinematicSurface, 0);
updateChapterState();
