/**
 * Gera public/og-image.png (1200x630): a imagem que aparece quando o link
 * do site é compartilhado no WhatsApp, LinkedIn, Facebook etc.
 * Rodar: node scripts/generate-og-image.mjs
 */
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(fileURLToPath(import.meta.url), "..", "..");
const logoPath = path.join(root, "LOGO", "solutionplay-logo-branca.png");
const out = path.join(root, "public", "og-image.png");

const W = 1200;
const H = 630;

// Cores da marca (iguais às de src/styles/site.css)
const night = "#07111f";
const deep = "#0c1a2e";
const cyan = "#33c9ea";
const orange = "#f5922f";
const ink = "#eaf1f8";
const steel = "#93a6bc";

const font = "Bahnschrift, 'Arial Narrow', Arial, sans-serif";

const svg = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${deep}"/>
      <stop offset="1" stop-color="${night}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.8" cy="0.42" r="0.42">
      <stop offset="0" stop-color="${cyan}" stop-opacity="0.32"/>
      <stop offset="1" stop-color="${cyan}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>

  <text x="80" y="128" font-family="${font}" font-size="40" font-weight="700" fill="${ink}">Solution <tspan fill="${cyan}">Play</tspan></text>

  <text font-family="${font}" font-weight="700" font-size="64" fill="${ink}" letter-spacing="-0.5">
    <tspan x="80" y="248">Suporte de TI,</tspan>
    <tspan x="80" y="322">segurança eletrônica</tspan>
    <tspan x="80" y="396">e sistemas em São Paulo</tspan>
  </text>

  <text x="80" y="470" font-family="${font}" font-size="30" fill="${steel}">NOC para provedores e desenvolvimento em Python</text>

  <rect x="80" y="512" width="380" height="64" rx="10" fill="${orange}"/>
  <text x="270" y="554" text-anchor="middle" font-family="${font}" font-size="28" font-weight="700" fill="#1c0f02">WhatsApp (11) 93741-5034</text>

  <text x="${W - 80}" y="560" text-anchor="end" font-family="${font}" font-size="24" fill="${steel}">solutionplay.com.br</text>
</svg>`;

const logo = await sharp(logoPath).resize(260, 260, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();

await sharp(Buffer.from(svg))
  .composite([{ input: logo, top: 120, left: W - 70 - 260 }])
  .png({ compressionLevel: 9 })
  .toFile(out);

console.log("Gerado public/og-image.png (1200x630)");
