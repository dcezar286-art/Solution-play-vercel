import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(fileURLToPath(import.meta.url), "..", "..");
const logoPath = path.join(root, "LOGO", "SolutionPlay.png");
const publicDir = path.join(root, "public");

await mkdir(publicDir, { recursive: true });

const faviconSizes = [
  { name: "favicon.png", size: 32 },
  { name: "apple-touch-icon.png", size: 180 },
];

for (const { name, size } of faviconSizes) {
  await sharp(logoPath)
    .resize(size, size, { fit: "contain", background: { r: 3, g: 3, b: 10, alpha: 1 } })
    .png()
    .toFile(path.join(publicDir, name));
}

// Imagem de compartilhamento (1200x630) com nome e proposta da marca.
await import("./generate-og-image.mjs");

console.log("Generated public/favicon.png, apple-touch-icon.png");
