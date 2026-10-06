# Solution Play 3D Cinematic Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a premium 3D/cinematic homepage experience for Solution Play while preserving all written content, official logo usage, conversion paths, and final pricing information.

**Architecture:** Keep Astro as the page framework and use a persistent full-bleed Three.js scene behind semantic HTML content chapters. Reuse `src/data/marketingContent.ts` as the single source of truth, replace video-led backgrounds with procedural 3D atmosphere, and keep pricing/contact content readable and accessible.

**Tech Stack:** Astro 5, TypeScript, Tailwind CSS 4, Three.js, GSAP, Lenis, existing Astro image pipeline.

**Spec:** `docs/superpowers/specs/2026-09-29-solution-play-3d-cinematic-redesign.md`

## Global Constraints

- Preserve 100% of the written content currently exported from `src/data/marketingContent.ts`.
- Preserve the official logo image proportions and do not redraw, distort, recolor, or replace the mark.
- Put MSP plans, one-off services, commercial notes, warranty text, software licensing text, and prices in the final decision chapter.
- Do not use existing MP4 videos as the main visual background of the redesigned homepage.
- Keep all user-readable commercial content in HTML, not only inside canvas.
- Respect `prefers-reduced-motion` with a calmer non-cinematic path.
- Keep form, WhatsApp, email, CNPJ, SEO schema, and main CTAs functional.
- Run `npm run build` before claiming implementation complete.

---

## File Structure

- Modify: `src/pages/index.astro`
  - Replace the current slide composition with the cinematic chapter structure.
  - Keep `BaseLayout`, schema, logo preload, nav, and conversion paths.
- Create: `src/components/CinematicScene.astro`
  - Owns the full-bleed canvas container, static fallback, and boot script.
- Create: `src/scripts/cinematicSceneBoot.ts`
  - Initializes Three.js renderer, scene, camera, procedural objects, resize handling, and animation loop.
- Create: `src/scripts/cinematicTimeline.ts`
  - Maps page scroll/chapter progress to camera movement, scene intensity, object states, and HTML chapter activation.
- Create: `src/scripts/motionPreference.ts`
  - Centralizes WebGL support, reduced-motion, coarse pointer, viewport, and DPR decisions.
- Create: `src/data/contentChapters.ts`
  - Defines chapter ids, labels, and navigation metadata without duplicating commercial copy.
- Create: `src/components/CinematicChapter.astro`
  - Provides the semantic HTML layout wrapper for each chapter.
- Create: `src/components/PricingFinale.astro`
  - Renders all MSP plans, one-off services, commercial notes, warranty, and licensing content at the final decision point.
- Modify: `src/components/InteractiveTopNav.astro`
  - Make navigation target chapter anchors instead of only slide jumps, while preserving existing accessible behavior.
- Modify: `src/styles/global.css`
  - Add cinematic layout, canvas layering, chapter typography, responsive pricing layout, and fallback styles.
- Modify: `src/scripts/spaSlidesBoot.ts` or remove usage from `src/pages/index.astro`
  - Stop the homepage from depending on the old four-slide controller if it conflicts with the new chapter scroll.
- Test: `npm run build`
  - Ensures Astro, TypeScript, asset imports, and generated pages compile.
- Test: browser QA with desktop `1440x900` and mobile `390x844`
  - Ensures canvas is visible, content is readable, pricing appears at the end, and form paths remain usable.

---

### Task 1: Content And Chapter Map

**Files:**
- Create: `src/data/contentChapters.ts`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `brand`, `hero`, `benefits`, `mspIntro`, `differentiators`, `mspPlans`, `oneOffServices`, `commercial`, `commercialPolicies`, `contact` from `src/data/marketingContent.ts`.
- Produces: `cinematicChapters`, an exported readonly array with ids `brand`, `services`, `trust`, `pricing`, `contact`.

- [ ] **Step 1: Create chapter metadata**

Create `src/data/contentChapters.ts` with:

```ts
export const cinematicChapters = [
  { id: "brand", label: "Inicio", scene: "core" },
  { id: "services", label: "Servicos", scene: "network" },
  { id: "trust", label: "Confianca", scene: "stability" },
  { id: "pricing", label: "Planos", scene: "pricing" },
  { id: "contact", label: "Contato", scene: "contact" },
] as const;

export type CinematicChapterId = (typeof cinematicChapters)[number]["id"];
export type CinematicSceneKey = (typeof cinematicChapters)[number]["scene"];
```

- [ ] **Step 2: Import chapter metadata in the homepage**

Modify `src/pages/index.astro` to import:

```ts
import { cinematicChapters } from "../data/contentChapters";
```

- [ ] **Step 3: Add temporary chapter anchors around existing sections**

Before replacing the visual layout, add stable ids matching the chapter map to the current major areas:

```astro
<article id="brand" data-chapter="brand" class="spa-slide is-active" data-slide="hero" aria-hidden="false">
```

Repeat for `services`, `pricing`, and `contact`. Add `id="trust"` later in Task 6 when that chapter is created.

- [ ] **Step 4: Build**

Run: `npm run build`

Expected: build passes and routes remain generated.

- [ ] **Step 5: Commit**

```bash
git add src/data/contentChapters.ts src/pages/index.astro
git commit -m "chore: map cinematic homepage chapters"
```

---

### Task 2: Motion Preference And Device Profile

**Files:**
- Create: `src/scripts/motionPreference.ts`
- Modify: `src/scripts/deviceProfile.ts` only if it already exposes equivalent helpers that should be reused.

**Interfaces:**
- Produces: `getMotionPreference(): MotionPreference`
- Produces type:

```ts
export type MotionPreference = {
  webgl: boolean;
  reducedMotion: boolean;
  coarsePointer: boolean;
  width: number;
  height: number;
  dpr: number;
  quality: "static" | "low" | "medium" | "high";
};
```

- [ ] **Step 1: Add the helper file**

Create `src/scripts/motionPreference.ts`:

```ts
export type MotionPreference = {
  webgl: boolean;
  reducedMotion: boolean;
  coarsePointer: boolean;
  width: number;
  height: number;
  dpr: number;
  quality: "static" | "low" | "medium" | "high";
};

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function getMotionPreference(): MotionPreference {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const webgl = supportsWebGL();
  const cappedDpr = Math.min(window.devicePixelRatio || 1, coarsePointer ? 1.5 : 2);

  let quality: MotionPreference["quality"] = "high";

  if (!webgl || reducedMotion) {
    quality = "static";
  } else if (coarsePointer || width < 768) {
    quality = "low";
  } else if (width < 1200) {
    quality = "medium";
  }

  return {
    webgl,
    reducedMotion,
    coarsePointer,
    width,
    height,
    dpr: cappedDpr,
    quality,
  };
}
```

- [ ] **Step 2: Build**

Run: `npm run build`

Expected: build passes.

- [ ] **Step 3: Commit**

```bash
git add src/scripts/motionPreference.ts
git commit -m "feat: add motion capability profile"
```

---

### Task 3: Full-Bleed Cinematic Scene

**Files:**
- Create: `src/components/CinematicScene.astro`
- Create: `src/scripts/cinematicSceneBoot.ts`
- Modify: `src/pages/index.astro`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: `getMotionPreference()` from `src/scripts/motionPreference.ts`.
- Produces: a fixed background scene mounted by `<CinematicScene />`.

- [ ] **Step 1: Create the Astro component**

Create `src/components/CinematicScene.astro`:

```astro
---
---

<div class="cinematic-scene" aria-hidden="true">
  <canvas class="cinematic-scene__canvas" data-cinematic-canvas></canvas>
  <div class="cinematic-scene__fallback"></div>
</div>

<script>
  import "../scripts/cinematicSceneBoot";
</script>
```

- [ ] **Step 2: Add initial Three.js boot code**

Create `src/scripts/cinematicSceneBoot.ts`:

```ts
import * as THREE from "three";
import { getMotionPreference } from "./motionPreference";

const canvas = document.querySelector<HTMLCanvasElement>("[data-cinematic-canvas]");

if (canvas) {
  const profile = getMotionPreference();

  if (profile.quality !== "static") {
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: profile.quality !== "low",
      alpha: true,
      powerPreference: "high-performance",
    });

    renderer.setPixelRatio(profile.dpr);
    renderer.setSize(profile.width, profile.height, false);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, profile.width / profile.height, 0.1, 120);
    camera.position.set(0, 0.4, 9);

    const group = new THREE.Group();
    scene.add(group);

    const geometry = new THREE.IcosahedronGeometry(1.85, 4);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.32,
      metalness: 0.72,
      transparent: true,
      opacity: 0.22,
      wireframe: true,
    });
    const core = new THREE.Mesh(geometry, material);
    group.add(core);

    const keyLight = new THREE.PointLight(0x72f7ff, 26, 22);
    keyLight.position.set(4, 3, 6);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0xff2d75, 14, 18);
    rimLight.position.set(-5, -2, 4);
    scene.add(rimLight);

    const resize = () => {
      const next = getMotionPreference();
      renderer.setPixelRatio(next.dpr);
      renderer.setSize(next.width, next.height, false);
      camera.aspect = next.width / next.height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", resize, { passive: true });

    const clock = new THREE.Clock();

    const tick = () => {
      const elapsed = clock.getElapsedTime();
      group.rotation.y = elapsed * 0.08;
      group.rotation.x = Math.sin(elapsed * 0.28) * 0.08;
      renderer.render(scene, camera);
      window.requestAnimationFrame(tick);
    };

    tick();
  } else {
    canvas.setAttribute("data-static", "true");
  }
}
```

- [ ] **Step 3: Mount the scene in the homepage**

In `src/pages/index.astro`, import and render the component directly inside `.spa-layout`, before navigation:

```astro
import CinematicScene from "../components/CinematicScene.astro";
```

```astro
<div class="spa-layout">
  <CinematicScene />
  <InteractiveTopNav />
```

- [ ] **Step 4: Add base styles**

Append to `src/styles/global.css`:

```css
.cinematic-scene {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
  background:
    radial-gradient(circle at 50% 35%, rgba(255, 255, 255, 0.1), transparent 32rem),
    linear-gradient(140deg, #05070b 0%, #111318 48%, #05070b 100%);
}

.cinematic-scene__canvas,
.cinematic-scene__fallback {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.cinematic-scene__fallback {
  background:
    linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(0deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: radial-gradient(circle at 50% 45%, black, transparent 72%);
}

.spa-stage,
.spa-main,
.spa-viewport,
.spa-track {
  position: relative;
  z-index: 1;
}
```

- [ ] **Step 5: Build**

Run: `npm run build`

Expected: build passes and the canvas script is bundled.

- [ ] **Step 6: Commit**

```bash
git add src/components/CinematicScene.astro src/scripts/cinematicSceneBoot.ts src/pages/index.astro src/styles/global.css
git commit -m "feat: add cinematic three dimensional scene"
```

---

### Task 4: Semantic Chapter Layout

**Files:**
- Create: `src/components/CinematicChapter.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: chapter ids from `src/data/contentChapters.ts`.
- Produces: reusable chapter shell with `id`, `data-chapter`, `aria-labelledby`, and layout variants.

- [ ] **Step 1: Create the chapter wrapper**

Create `src/components/CinematicChapter.astro`:

```astro
---
interface Props {
  id: string;
  labelledby: string;
  tone?: "hero" | "standard" | "pricing" | "contact";
}

const { id, labelledby, tone = "standard" } = Astro.props;
---

<section
  id={id}
  data-chapter={id}
  class:list={["cinematic-chapter", `cinematic-chapter--${tone}`]}
  aria-labelledby={labelledby}
>
  <div class="cinematic-chapter__inner">
    <slot />
  </div>
</section>
```

- [ ] **Step 2: Replace slide article wrappers**

In `src/pages/index.astro`, import:

```astro
import CinematicChapter from "../components/CinematicChapter.astro";
```

Replace slide `<article>` wrappers with `<CinematicChapter>` wrappers while keeping the existing inner copy, logo, benefits, services, commercial, and contact components.

Use these ids and labels:

```astro
<CinematicChapter id="brand" labelledby="hero-heading" tone="hero">
<CinematicChapter id="services" labelledby="servicos-heading">
<CinematicChapter id="trust" labelledby="confianca-heading">
<CinematicChapter id="pricing" labelledby="comercial-heading" tone="pricing">
<CinematicChapter id="contact" labelledby="contato-heading" tone="contact">
```

- [ ] **Step 3: Add chapter layout CSS**

Append to `src/styles/global.css`:

```css
.cinematic-chapter {
  position: relative;
  min-height: 100svh;
  display: flex;
  align-items: center;
  color: #fff;
  isolation: isolate;
}

.cinematic-chapter__inner {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  padding: clamp(88px, 10vh, 132px) 0;
}

.cinematic-chapter--hero .cinematic-chapter__inner {
  min-height: 100svh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cinematic-chapter--pricing {
  align-items: flex-start;
}

.cinematic-chapter--contact {
  align-items: center;
}
```

- [ ] **Step 4: Build**

Run: `npm run build`

Expected: build passes. Homepage still contains the original visible copy.

- [ ] **Step 5: Commit**

```bash
git add src/components/CinematicChapter.astro src/pages/index.astro src/styles/global.css
git commit -m "feat: convert homepage into semantic cinematic chapters"
```

---

### Task 5: Remove Video-Led Backgrounds From Homepage

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: `<CinematicScene />` from Task 3.
- Produces: homepage that no longer mounts `SlideVideoBackdrop` as the primary visual background.

- [ ] **Step 1: Remove video backdrop imports from homepage**

Remove this import from `src/pages/index.astro`:

```astro
import SlideVideoBackdrop from "../components/SlideVideoBackdrop.astro";
```

- [ ] **Step 2: Remove video backdrop instances from homepage**

Delete these component usages from `src/pages/index.astro`:

```astro
<SlideVideoBackdrop
  slide="hero"
  videoSrc="/media/background-inicio.mp4"
  posterSrc="/media/hero-bg.webp"
  eagerPreload
/>
```

Delete the `services` and `commercial` `SlideVideoBackdrop` usages as well.

- [ ] **Step 3: Add overlay depth without video**

Append to `src/styles/global.css`:

```css
.cinematic-chapter::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    linear-gradient(90deg, rgba(5, 7, 11, 0.92), rgba(5, 7, 11, 0.42) 42%, rgba(5, 7, 11, 0.86)),
    radial-gradient(circle at 72% 40%, rgba(255, 255, 255, 0.08), transparent 30rem);
}

.cinematic-chapter--hero::before {
  background:
    radial-gradient(circle at 50% 44%, rgba(255, 255, 255, 0.12), transparent 34rem),
    linear-gradient(180deg, rgba(5, 7, 11, 0.38), rgba(5, 7, 11, 0.82));
}
```

- [ ] **Step 4: Build**

Run: `npm run build`

Expected: build passes and no homepage video components are imported.

- [ ] **Step 5: Commit**

```bash
git add src/pages/index.astro src/styles/global.css
git commit -m "feat: replace homepage video backgrounds with cinematic scene"
```

---

### Task 6: Trust Chapter

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: `benefits`, `differentiators`, and `brand` from `src/data/marketingContent.ts`.
- Produces: a distinct trust chapter between services and pricing.

- [ ] **Step 1: Import required data**

In `src/pages/index.astro`, extend the marketing content import:

```astro
import { brand, hero, benefits, differentiators, commercial, contact } from "../data/marketingContent";
```

- [ ] **Step 2: Add the trust chapter**

Add after the services chapter:

```astro
<CinematicChapter id="trust" labelledby="confianca-heading">
  <div class="trust-chapter">
    <p class="section-eyebrow">Por que a Solution Play</p>
    <h2 id="confianca-heading">Tecnologia ativa para o seu negocio</h2>
    <div class="trust-grid">
      {benefits.map((item) => (
        <article class="trust-item">
          <h3>{item.title}</h3>
          <p>{item.desc}</p>
        </article>
      ))}
    </div>
    <ul class="trust-differentiators">
      {differentiators.map((item) => <li>{item}</li>)}
    </ul>
    <p class="trust-site">{brand.siteDisplay}</p>
  </div>
</CinematicChapter>
```

- [ ] **Step 3: Add trust styles**

Append to `src/styles/global.css`:

```css
.trust-chapter {
  max-width: 980px;
}

.trust-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-top: 32px;
}

.trust-item {
  min-height: 150px;
  padding: 22px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.055);
  backdrop-filter: blur(18px);
}

.trust-item h3 {
  margin: 0 0 10px;
  font-size: 1rem;
}

.trust-item p,
.trust-differentiators,
.trust-site {
  color: rgba(255, 255, 255, 0.78);
}

.trust-differentiators {
  display: grid;
  gap: 10px;
  margin: 28px 0 0;
  padding: 0;
  list-style: none;
}

.trust-site {
  margin-top: 24px;
}

@media (max-width: 900px) {
  .trust-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .trust-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 4: Build**

Run: `npm run build`

Expected: build passes and the trust chapter renders imported copy only.

- [ ] **Step 5: Commit**

```bash
git add src/pages/index.astro src/styles/global.css
git commit -m "feat: add trust chapter to cinematic homepage"
```

---

### Task 7: Pricing Finale

**Files:**
- Create: `src/components/PricingFinale.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: `mspPlans`, `oneOffServices`, `commercial`, `commercialPolicies` from `src/data/marketingContent.ts`.
- Produces: `<PricingFinale />`.

- [ ] **Step 1: Create pricing finale component**

Create `src/components/PricingFinale.astro`:

```astro
---
import { commercial, commercialPolicies, mspPlans, oneOffServices } from "../data/marketingContent";
---

<div class="pricing-finale">
  <div class="pricing-finale__intro">
    <p class="section-eyebrow">Decisao</p>
    <h2 id="comercial-heading">{commercial.headline}</h2>
    <p>{commercial.plansNote}</p>
  </div>

  <div class="pricing-grid">
    {mspPlans.map((plan) => (
      <article class="pricing-plan">
        <div>
          <h3>{plan.name}</h3>
          <p class="pricing-plan__scope">{plan.scope}</p>
        </div>
        <p class="pricing-plan__price">{plan.price}</p>
        <ul>
          {plan.includes.map((item) => <li>{item}</li>)}
        </ul>
      </article>
    ))}
  </div>

  <div class="pricing-support">
    <section>
      <h3>Servicos avulsos</h3>
      <ul>
        {oneOffServices.map((service) => (
          <li>
            <span>{service.title}</span>
            <strong>{service.price}</strong>
          </li>
        ))}
      </ul>
    </section>

    <section>
      <h3>{commercialPolicies.title}</h3>
      {commercialPolicies.items.map((item) => (
        <article>
          <h4>{item.heading}</h4>
          <p>{item.body}</p>
        </article>
      ))}
    </section>
  </div>

  <div class="pricing-notes">
    <p>{commercial.note}</p>
    <p>{commercial.validityNote}</p>
    <p>{commercial.paymentNote}</p>
    <p>Prazo contratual: {commercial.terms.join(", ")}.</p>
  </div>
</div>
```

- [ ] **Step 2: Replace old pricing composition**

In `src/pages/index.astro`, import:

```astro
import PricingFinale from "../components/PricingFinale.astro";
```

Replace `<CommercialMSP />` inside the pricing chapter with:

```astro
<PricingFinale />
```

- [ ] **Step 3: Add pricing styles**

Append to `src/styles/global.css`:

```css
.pricing-finale {
  width: 100%;
}

.pricing-finale__intro {
  max-width: 760px;
  margin-bottom: 34px;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
}

.pricing-plan {
  display: grid;
  align-content: start;
  gap: 18px;
  min-height: 360px;
  padding: 22px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(18px);
}

.pricing-plan h3 {
  margin: 0;
  font-size: 1rem;
}

.pricing-plan__scope {
  margin: 8px 0 0;
  color: rgba(255, 255, 255, 0.68);
}

.pricing-plan__price {
  margin: 0;
  font-size: clamp(1.45rem, 3vw, 2.2rem);
  font-weight: 800;
}

.pricing-plan ul,
.pricing-support ul {
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
  color: rgba(255, 255, 255, 0.76);
}

.pricing-support {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 16px;
  margin-top: 18px;
}

.pricing-support section,
.pricing-notes {
  padding: 22px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.055);
  backdrop-filter: blur(18px);
}

.pricing-support li {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.pricing-notes {
  display: grid;
  gap: 8px;
  margin-top: 18px;
  color: rgba(255, 255, 255, 0.76);
}

.pricing-notes p {
  margin: 0;
}

@media (max-width: 1180px) {
  .pricing-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 680px) {
  .pricing-grid,
  .pricing-support {
    grid-template-columns: 1fr;
  }

  .pricing-plan {
    min-height: auto;
  }
}
```

- [ ] **Step 4: Build**

Run: `npm run build`

Expected: build passes. Pricing chapter contains all plans, services, notes, warranty, and licensing content.

- [ ] **Step 5: Commit**

```bash
git add src/components/PricingFinale.astro src/pages/index.astro src/styles/global.css
git commit -m "feat: present pricing as final cinematic decision chapter"
```

---

### Task 8: Scroll Timeline

**Files:**
- Create: `src/scripts/cinematicTimeline.ts`
- Modify: `src/components/CinematicScene.astro`
- Modify: `src/scripts/cinematicSceneBoot.ts`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: `[data-chapter]` sections.
- Produces: CSS variable `--chapter-progress` and document attribute `data-active-chapter`.

- [ ] **Step 1: Create the timeline script**

Create `src/scripts/cinematicTimeline.ts`:

```ts
const chapters = Array.from(document.querySelectorAll<HTMLElement>("[data-chapter]"));

function updateChapterState() {
  const viewportMiddle = window.scrollY + window.innerHeight * 0.5;
  let active = chapters[0]?.dataset.chapter || "brand";

  for (const chapter of chapters) {
    const top = chapter.offsetTop;
    const bottom = top + chapter.offsetHeight;

    if (viewportMiddle >= top && viewportMiddle < bottom) {
      active = chapter.dataset.chapter || active;
      const progress = Math.min(Math.max((viewportMiddle - top) / chapter.offsetHeight, 0), 1);
      document.documentElement.style.setProperty("--chapter-progress", progress.toFixed(4));
      break;
    }
  }

  document.documentElement.dataset.activeChapter = active;
}

window.addEventListener("scroll", updateChapterState, { passive: true });
window.addEventListener("resize", updateChapterState, { passive: true });
updateChapterState();
```

- [ ] **Step 2: Import timeline script**

In `src/components/CinematicScene.astro`, add:

```astro
<script>
  import "../scripts/cinematicSceneBoot";
  import "../scripts/cinematicTimeline";
</script>
```

- [ ] **Step 3: React to active chapter in scene boot**

In `src/scripts/cinematicSceneBoot.ts`, inside `tick`, read:

```ts
const activeChapter = document.documentElement.dataset.activeChapter || "brand";
const chapterProgress = Number.parseFloat(
  getComputedStyle(document.documentElement).getPropertyValue("--chapter-progress") || "0",
);

const targetZ = activeChapter === "pricing" ? 7.2 : activeChapter === "contact" ? 8.4 : 9;
camera.position.z += (targetZ - camera.position.z) * 0.04;
core.scale.setScalar(1 + chapterProgress * 0.08);
```

- [ ] **Step 4: Add active chapter styling hooks**

Append to `src/styles/global.css`:

```css
:root[data-active-chapter="pricing"] .cinematic-scene {
  filter: saturate(0.92) brightness(1.08);
}

:root[data-active-chapter="contact"] .cinematic-scene {
  filter: saturate(0.82) brightness(0.92);
}
```

- [ ] **Step 5: Build**

Run: `npm run build`

Expected: build passes. Scrolling updates active chapter state without console errors.

- [ ] **Step 6: Commit**

```bash
git add src/scripts/cinematicTimeline.ts src/components/CinematicScene.astro src/scripts/cinematicSceneBoot.ts src/styles/global.css
git commit -m "feat: connect cinematic scene to chapter scroll"
```

---

### Task 9: Navigation And Conversion Paths

**Files:**
- Modify: `src/components/InteractiveTopNav.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: chapter ids `brand`, `services`, `pricing`, `contact`.
- Produces: nav and CTA actions that scroll to anchors.

- [ ] **Step 1: Replace slide jump attributes for anchors**

In `src/pages/index.astro`, replace:

```astro
data-slide-jump="contact"
```

with:

```astro
data-chapter-jump="contact"
```

Replace `data-slide-jump="services"` with `data-chapter-jump="services"`.

- [ ] **Step 2: Add chapter jump handler**

In the existing home motion or nav script that handles slide jumps, add:

```ts
document.querySelectorAll<HTMLElement>("[data-chapter-jump]").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const target = trigger.dataset.chapterJump;
    const element = target ? document.getElementById(target) : null;
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
```

- [ ] **Step 3: Keep direct contact actions**

Confirm these links still exist in the contact chapter:

```astro
mailto:${brand.email}
https://wa.me/${brand.whatsapp}
```

- [ ] **Step 4: Build**

Run: `npm run build`

Expected: build passes and CTA attributes are valid.

- [ ] **Step 5: Commit**

```bash
git add src/components/InteractiveTopNav.astro src/pages/index.astro src/styles/global.css
git commit -m "feat: align navigation with cinematic chapters"
```

---

### Task 10: Accessibility, Reduced Motion, And Responsive Polish

**Files:**
- Modify: `src/styles/global.css`
- Modify: `src/scripts/cinematicSceneBoot.ts`
- Modify: `src/components/CinematicScene.astro`

**Interfaces:**
- Consumes: `getMotionPreference()`.
- Produces: readable, responsive, accessible experience across desktop and mobile.

- [ ] **Step 1: Add reduced motion CSS**

Append to `src/styles/global.css`:

```css
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }

  .cinematic-scene__canvas {
    display: none;
  }
}
```

- [ ] **Step 2: Improve mobile spacing**

Append to `src/styles/global.css`:

```css
@media (max-width: 720px) {
  .cinematic-chapter {
    min-height: auto;
  }

  .cinematic-chapter__inner {
    width: min(100% - 24px, 1180px);
    padding: 88px 0;
  }

  .hero-brand-row {
    gap: 12px;
  }

  .hero-brand-mark {
    width: 52px;
    height: 52px;
  }
}
```

- [ ] **Step 3: Confirm canvas is hidden from assistive tech**

Ensure `src/components/CinematicScene.astro` keeps:

```astro
<div class="cinematic-scene" aria-hidden="true">
```

- [ ] **Step 4: Build**

Run: `npm run build`

Expected: build passes.

- [ ] **Step 5: Commit**

```bash
git add src/styles/global.css src/scripts/cinematicSceneBoot.ts src/components/CinematicScene.astro
git commit -m "fix: polish responsive and reduced motion behavior"
```

---

### Task 11: Visual QA And Final Verification

**Files:**
- Modify only files required by issues found during QA.

**Interfaces:**
- Consumes: completed homepage.
- Produces: verified final state.

- [ ] **Step 1: Build production output**

Run:

```bash
npm run build
```

Expected: build passes.

- [ ] **Step 2: Start local dev server**

Run:

```bash
npm run dev
```

Expected: Astro prints a local URL, usually `http://localhost:4321`.

- [ ] **Step 3: Desktop visual QA**

Open the local URL at `1440x900` and verify:

```text
Logo official visible in first viewport.
Hero copy is readable.
3D background is visible and nonblank.
Scrolling reaches services, trust, pricing, and contact chapters.
Pricing appears after the service/trust narrative.
No text overlaps the logo, nav, cards, or form.
```

- [ ] **Step 4: Mobile visual QA**

Open the local URL at `390x844` and verify:

```text
Logo official visible without distortion.
Hero text fits without horizontal scroll.
Pricing cards stack vertically.
WhatsApp, email, and form remain usable.
3D visual does not block reading or tapping.
```

- [ ] **Step 5: Reduced motion QA**

Enable reduced motion in browser emulation and verify:

```text
Canvas motion is removed or substantially reduced.
All content remains visible.
Navigation and CTAs still work.
```

- [ ] **Step 6: Fix issues found**

Apply only targeted fixes to files related to the issue. After each fix, rerun:

```bash
npm run build
```

- [ ] **Step 7: Final commit**

```bash
git status --short
git add src docs
git commit -m "feat: complete cinematic Solution Play homepage"
```

---

## Self-Review

- Spec coverage: the plan covers brand/logo preservation, content preservation, 3D scene, chapter narrative, final pricing, contact paths, reduced motion, mobile, and production build.
- Placeholder scan: the plan avoids deferred implementation language and includes concrete file paths, interfaces, code snippets, commands, and expected checks.
- Type consistency: `CinematicChapterId`, `CinematicSceneKey`, `MotionPreference`, `getMotionPreference`, `cinematicChapters`, and data chapter ids are defined before later tasks consume them.
