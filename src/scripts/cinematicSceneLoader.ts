const loadCinematicScene = () => import("./cinematicSceneBoot").catch(() => {
  // The illustrated core remains visible if WebGL or the lazy chunk fails.
  delete document.documentElement.dataset.sceneReady;
});

if ("requestIdleCallback" in window) {
  window.requestIdleCallback(() => void loadCinematicScene(), { timeout: 1200 });
} else {
  window.setTimeout(() => void loadCinematicScene(), 180);
}
