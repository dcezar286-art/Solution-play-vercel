import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), "utf8");

const requiredFiles = [
  "LOGO/SolutionPlay-removebg-preview.png",
  "src/components/CinematicScene.astro",
  "src/components/CinematicChapter.astro",
  "src/components/PricingFinale.astro",
  "src/data/contentChapters.ts",
  "src/scripts/cinematicSceneBoot.ts",
  "src/scripts/cinematicSceneLoader.ts",
  "src/scripts/immersiveDeckBoot.ts",
  "src/scripts/cinematicTimeline.ts",
  "src/scripts/motionPreference.ts",
];

const missing = requiredFiles.filter((path) => !existsSync(join(root, path)));

if (missing.length) {
  throw new Error(`Missing cinematic files:\n${missing.join("\n")}`);
}

const index = read("src/pages/index.astro");
const content = read("src/data/marketingContent.ts");
const pricing = read("src/components/PricingFinale.astro");
const styles = read("src/styles/global.css");
const sceneBoot = read("src/scripts/cinematicSceneBoot.ts");
const sceneLoader = read("src/scripts/cinematicSceneLoader.ts");
const immersiveDeck = read("src/scripts/immersiveDeckBoot.ts");

const requiredIndexTokens = [
  "<CinematicScene",
  "<CinematicChapter id=\"brand\"",
  "<CinematicChapter id=\"services\"",
  "<CinematicChapter id=\"trust\"",
  "<CinematicChapter id=\"pricing\"",
  "<CinematicChapter id=\"contact\"",
  "<PricingFinale",
  "data-chapter-jump=\"contact\"",
  "data-chapter-jump=\"services\"",
  "data-motion-card",
];

const missingIndexTokens = requiredIndexTokens.filter((token) => !index.includes(token));

if (missingIndexTokens.length) {
  throw new Error(`Homepage is missing required cinematic markers:\n${missingIndexTokens.join("\n")}`);
}

for (const token of ["@media (min-width: 1181px) and (max-width: 1600px)", "padding-inline: clamp(3rem, 8vw, 9rem)", "@media (max-width: 900px)", "@media (max-width: 1180px) and (min-width: 901px)", ".msp-plan-list", ".cinematic-chapter__inner", "font-size: clamp(2rem, 4vw, 3.1rem)", "--card-x: 0rem"]) {
  if (!styles.includes(token)) {
    throw new Error(`Responsive cinematic layout is missing marker: ${token}`);
  }
}

const forbiddenIndexTokens = [
  "SlideVideoBackdrop",
  "background-inicio.mp4",
  "background-servico.mp4",
  "background-contratos.mp4",
  "<HomeSpaMotion",
];

const forbiddenFound = forbiddenIndexTokens.filter((token) => index.includes(token));

if (forbiddenFound.length) {
  throw new Error(`Homepage still contains legacy video/slide markers:\n${forbiddenFound.join("\n")}`);
}

for (const token of ["mspPlans", "oneOffServices", "commercialPolicies", "commercial"]) {
  if (!pricing.includes(token)) {
    throw new Error(`PricingFinale must render content from marketingContent: missing ${token}`);
  }
}

for (const token of ["createSolutionPlayCube", "RoundedBoxGeometry", "ringVisibilityScale", "cubeTiles", "tileHome", "0x111820", "0x18a8bd"]) {
  if (!sceneBoot.includes(token)) {
    throw new Error(`Cinematic scene must include procedural Solution Play cube marker: missing ${token}`);
  }
}

for (const token of ["CHAPTER_IDS", "__solutionPlayGoToChapter", "ArrowDown", "ArrowUp", "handleWheelNavigation"]) {
  if (!immersiveDeck.includes(token)) {
    throw new Error(`Immersive deck must include scene navigation marker: missing ${token}`);
  }
}

for (const token of ["requestIdleCallback", "cinematicSceneBoot"]) {
  if (!sceneLoader.includes(token)) {
    throw new Error(`Cinematic scene loader is missing marker: ${token}`);
  }
}

for (const literal of ["START", "ESSENCIAL", "PROFISSIONAL", "BUSINESS", "ENTERPRISE"]) {
  if (!content.includes(literal)) {
    throw new Error(`marketingContent is unexpectedly missing ${literal}`);
  }
}

for (const token of ["data-motion-card=\"pricing-plan\"", "pricing-plan--featured"]) {
  if (!pricing.includes(token)) {
    throw new Error(`Pricing scene is missing motion marker: ${token}`);
  }
}

console.log("Cinematic homepage source verification passed.");
