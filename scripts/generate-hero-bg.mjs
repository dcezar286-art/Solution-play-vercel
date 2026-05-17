import sharp from "sharp";
import { mkdir } from "node:fs/promises";

await mkdir("public/media", { recursive: true });

function buildSvg(width, height, mobile = false) {
  const cx = mobile ? "72%" : "78%";
  const cy = mobile ? "28%" : "32%";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <radialGradient id="base" cx="50%" cy="50%" r="80%">
      <stop offset="0%" stop-color="#0a1620"/>
      <stop offset="55%" stop-color="#050810"/>
      <stop offset="100%" stop-color="#000000"/>
    </radialGradient>
    <radialGradient id="haze" cx="${cx}" cy="${cy}" r="55%">
      <stop offset="0%" stop-color="#2dd4bf" stop-opacity="0.45"/>
      <stop offset="35%" stop-color="#0d9488" stop-opacity="0.22"/>
      <stop offset="70%" stop-color="#071520" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="arc" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#5eead4" stop-opacity="0"/>
      <stop offset="42%" stop-color="#a7f3ec" stop-opacity="0.85"/>
      <stop offset="52%" stop-color="#ffffff" stop-opacity="0.95"/>
      <stop offset="62%" stop-color="#22d3ee" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#0f766e" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="vignette" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#000" stop-opacity="0.35"/>
      <stop offset="45%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.75"/>
    </linearGradient>
    <filter id="blur" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="${mobile ? 28 : 42}"/>
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#base)"/>
  <rect width="100%" height="100%" fill="url(#haze)"/>
  <ellipse cx="${mobile ? width * 0.62 : width * 0.72}" cy="${mobile ? height * 0.38 : height * 0.42}"
    rx="${width * 0.95}" ry="${height * 0.38}" fill="url(#arc)" filter="url(#blur)" opacity="0.9"/>
  <ellipse cx="${width * 0.5}" cy="${height * 0.55}" rx="${width * 0.7}" ry="${height * 0.25}"
    fill="url(#arc)" opacity="0.25" filter="url(#blur)"/>
  <rect width="100%" height="100%" fill="url(#vignette)"/>
</svg>`;
}

await sharp(Buffer.from(buildSvg(2560, 1440)))
  .webp({ quality: 84, effort: 6 })
  .toFile("public/media/hero-bg.webp");

await sharp(Buffer.from(buildSvg(1080, 1920, true)))
  .webp({ quality: 82, effort: 6 })
  .toFile("public/media/hero-bg-mobile.webp");

console.log("Generated public/media/hero-bg.webp and hero-bg-mobile.webp");
