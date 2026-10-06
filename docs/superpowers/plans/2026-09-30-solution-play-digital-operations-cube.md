# Solution Play Digital Operations Cube Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current abstract cinematic background with a Hubtown-inspired scene system centered on a procedural Solution Play cube.

**Architecture:** Keep the existing Astro chapters and Three.js canvas. Upgrade the canvas scene to a modular cube object, extend the timeline to handle scroll and keyboard scene changes, and add motion-card markers/styles for high-level card choreography.

**Tech Stack:** Astro 5, TypeScript, Three.js, GSAP, CSS custom properties.

**Spec:** `docs/superpowers/specs/2026-09-30-solution-play-digital-operations-cube.md`

## Global Constraints

- Do not push or publish without explicit user authorization.
- Keep the Solution Play name and official logo.
- Build the cube procedurally in Three.js for this first version.
- Keep all commercial content readable in HTML.
- Preserve local build verification.

---

### Task 1: Procedural Solution Play Cube

**Files:**
- Modify: `src/scripts/cinematicSceneBoot.ts`

**Interfaces:**
- Consumes: `document.documentElement.dataset.activeChapter`
- Produces: a modular cube, rings, particles, and scene states per chapter.

- [ ] Replace the icosahedron core with a group of small box meshes.
- [ ] Add chapter-specific transforms for cube position, scale, rotation, emissive intensity, and tile spread.
- [ ] Keep a low-quality path for mobile.
- [ ] Run `npm run build`.

### Task 2: Scene Choreography And Keyboard

**Files:**
- Modify: `src/scripts/cinematicTimeline.ts`

**Interfaces:**
- Produces: keyboard scene navigation for ArrowDown, ArrowUp, PageDown, PageUp.
- Produces: `data-scene-index` and `--chapter-progress`.

- [ ] Add ordered chapter ids.
- [ ] Implement `goToChapter(directionOrId)`.
- [ ] Bind keyboard navigation.
- [ ] Keep click navigation working.
- [ ] Run `npm run verify:cinematic`.

### Task 3: Motion Card Markers

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/components/PricingFinale.astro`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: `[data-motion-card]`.
- Produces: cards that visually reposition by active chapter.

- [ ] Add `data-motion-card` markers to hero, service, trust, pricing, and contact modules.
- [ ] Add Hubtown-like HUD frame and scene rail styling.
- [ ] Add chapter-specific card transforms.
- [ ] Add reduced-motion override.

### Task 4: Verification

**Files:**
- Modify: `scripts/verify-cinematic-homepage.mjs`

**Interfaces:**
- Consumes: source files.
- Produces: verification for cube and motion markers.

- [ ] Check for `createSolutionPlayCube` or equivalent cube marker.
- [ ] Check for keyboard navigation markers.
- [ ] Check for `data-motion-card`.
- [ ] Run `npm run verify:cinematic`.
- [ ] Run `npm run build`.
