/**
 * Movimento da página (leve, sem bibliotecas):
 * - seção ativa → <html data-scene> (cubo, cor do fundo e menu reagem)
 * - variável CSS --scroll para o cubo em CSS girar com a rolagem
 * - entrada suave dos blocos [data-reveal]
 * - menu do celular e cartões que expandem
 */

const root = document.documentElement;
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Rolagem: header + --scroll ---------- */
const header = document.querySelector<HTMLElement>("[data-header]");
let ticking = false;
const onScroll = () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    const y = window.scrollY;
    header?.classList.toggle("is-scrolled", y > 12);
    if (!reduced) root.style.setProperty("--scroll", (y / Math.max(innerHeight, 1)).toFixed(4));
  });
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- Seção ativa ---------- */
const scenes = [...document.querySelectorAll<HTMLElement>("[data-scene]")];
const navLinks = [...document.querySelectorAll<HTMLAnchorElement>("[data-nav]")];

if (scenes.length) {
  root.dataset.scene = scenes[0].dataset.scene;
  const pick = () => {
    // A seção que cruza a linha a 45% da altura da tela é a ativa.
    const line = innerHeight * 0.45;
    let active = scenes[0];
    for (const s of scenes) {
      const r = s.getBoundingClientRect();
      if (r.top <= line && r.bottom > line) active = s;
    }
    const name = active.dataset.scene!;
    if (root.dataset.scene !== name) {
      root.dataset.scene = name;
      navLinks.forEach((a) => a.classList.toggle("is-active", a.dataset.nav === name));
    }
  };
  const io = new IntersectionObserver(pick, { threshold: [0, 0.25, 0.5, 0.75, 1] });
  scenes.forEach((s) => io.observe(s));
  window.addEventListener("scroll", () => requestAnimationFrame(pick), { passive: true });
}

/* ---------- Entrada dos blocos ---------- */
const reveals = document.querySelectorAll<HTMLElement>("[data-reveal]");
if (reduced || !("IntersectionObserver" in window)) {
  reveals.forEach((el) => el.classList.add("is-in"));
} else {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      }),
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
  );
  reveals.forEach((el) => io.observe(el));
}

/* ---------- Menu do celular ---------- */
const toggle = document.querySelector<HTMLButtonElement>("[data-menu-toggle]");
const sheet = document.querySelector<HTMLElement>("[data-menu-sheet]");
const setMenu = (open: boolean) => {
  if (!toggle || !sheet) return;
  toggle.setAttribute("aria-expanded", String(open));
  root.classList.toggle("menu-open", open);
  if (open) sheet.hidden = false;
  else window.setTimeout(() => !root.classList.contains("menu-open") && (sheet.hidden = true), 320);
};
toggle?.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
sheet?.querySelectorAll("[data-menu-link]").forEach((a) => a.addEventListener("click", () => setMenu(false)));
window.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

/* ---------- Cartões que expandem (celular) ---------- */
document.querySelectorAll<HTMLButtonElement>("[data-expand]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const card = btn.closest<HTMLElement>("[data-card]");
    if (!card) return;
    const open = card.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", String(open));
  });
});
