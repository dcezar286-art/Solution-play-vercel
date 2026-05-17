import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const w = 1080;
const h = 1920;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs>
    <radialGradient id="g" cx="60%" cy="40%" r="75%">
      <stop offset="0%" stop-color="#0d2a3a"/>
      <stop offset="40%" stop-color="#071520"/>
      <stop offset="100%" stop-color="#07090f"/>
    </radialGradient>
    <radialGradient id="glow" cx="55%" cy="35%" r="45%">
      <stop offset="0%" stop-color="#1a4a5c" stop-opacity="0.55"/>
      <stop offset="70%" stop-color="#071520" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="#07090f"/>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect width="100%" height="100%" fill="url(#glow)"/>
</svg>`;

await mkdir("public/media", { recursive: true });
await sharp(Buffer.from(svg)).webp({ quality: 82 }).toFile("public/media/hero-bg-mobile.webp");
console.log("Wrote public/media/hero-bg-mobile.webp");
