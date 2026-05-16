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

const ogWidth = 1200;
const ogHeight = 630;
const logoOnOg = 280;

const logoBuffer = await sharp(logoPath)
  .resize(logoOnOg, logoOnOg, { fit: "contain", background: { r: 3, g: 3, b: 10, alpha: 1 } })
  .png()
  .toBuffer();

await sharp({
  create: {
    width: ogWidth,
    height: ogHeight,
    channels: 3,
    background: { r: 3, g: 3, b: 10 },
  },
})
  .composite([{ input: logoBuffer, gravity: "center" }])
  .png()
  .toFile(path.join(publicDir, "og-image.png"));

console.log("Generated public/favicon.png, apple-touch-icon.png, og-image.png");
