import gsap from "gsap";

let menuEl: HTMLElement | null = null;
let cursorEl: HTMLElement | null = null;
let rippleEl: HTMLElement | null = null;
let firstSync = true;

function moveCursorTo(target: HTMLElement, opacity = 1, instant = false) {
  if (!menuEl || !cursorEl) return;

  const menuRect = menuEl.getBoundingClientRect();
  const rect = target.getBoundingClientRect();
  const left = rect.left - menuRect.left;
  const width = rect.width;

  if (!instant) {
    gsap.killTweensOf(rippleEl);
  }

  if (instant) {
    gsap.killTweensOf([cursorEl, rippleEl].filter(Boolean));
    gsap.set(cursorEl, { left, width, opacity, scaleY: 1, scaleX: 1 });
    return;
  }

  gsap.killTweensOf(cursorEl);
  gsap.fromTo(
    cursorEl,
    { scaleY: 1.1, scaleX: 0.96 },
    {
      left,
      width,
      opacity,
      scaleY: 1,
      scaleX: 1,
      duration: 0.58,
      ease: "sine.inOut",
      overwrite: "auto",
    }
  );

  if (rippleEl) {
    gsap.fromTo(
      rippleEl,
      { scaleX: 0.35, opacity: 0.55 },
      { scaleX: 1.25, opacity: 0, duration: 0.75, ease: "power2.out" }
    );
  }
}

export function syncMenuCursor(instant = false) {
  if (!menuEl) return;
  const active = menuEl.querySelector<HTMLElement>(".interactive-menu__item.active");
  if (active) {
    moveCursorTo(active, 1, instant || firstSync);
    firstSync = false;
  }
}

export function initInteractiveMenuGlass() {
  menuEl = document.querySelector<HTMLElement>("[data-interactive-menu]");
  if (!menuEl) return;

  cursorEl = menuEl.querySelector<HTMLElement>(".interactive-menu__cursor");
  if (!cursorEl) return;

  rippleEl = cursorEl.querySelector<HTMLElement>(".interactive-menu__cursor-ripple");

  const items = menuEl.querySelectorAll<HTMLElement>(".interactive-menu__item");

  items.forEach((item) => {
    item.addEventListener("mouseenter", () => moveCursorTo(item, 1, false));
  });

  menuEl.addEventListener("mouseleave", () => syncMenuCursor(false));

  const ro = () => syncMenuCursor(true);
  window.addEventListener("resize", ro);
  firstSync = true;
  requestAnimationFrame(() => syncMenuCursor(true));
}

/** @deprecated mantido por compatibilidade */
export function updateInteractiveMenuLine(activeIndex: number) {
  if (!menuEl) return;
  const items = menuEl.querySelectorAll<HTMLElement>(".interactive-menu__item");
  const btn = items[activeIndex];
  if (btn) moveCursorTo(btn, 1, false);
}

void initInteractiveMenuGlass();
document.addEventListener("astro:page-load", initInteractiveMenuGlass);
