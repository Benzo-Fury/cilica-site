/**
 * Renders public/og.png (1200x630, the social card) and public/apple-touch-icon.png from SVG with
 * resvg and the bundled Inter. Run: bun run og
 * Provenance: drawn entirely in this script from the Ridgeline icon's colours; no external imagery.
 */
import { Resvg } from "@resvg/resvg-js";
import { writeFileSync } from "node:fs";

const fonts = ["scripts/fonts/Inter-SemiBold.ttf", "scripts/fonts/Inter-Bold.ttf"]; // Inter 4.1, OFL (scripts/fonts/Inter-LICENSE.txt)

const ridges = ["#efe5d6", "#d9c9b4", "#b5a695", "#8f8275", "#5a524a", "#1c1a18"];
function wave(i: number, w: number, base: number, amp: number) {
  let d = `M0 ${base}`;
  for (let x = 0; x <= w; x += 20) d += ` L${x} ${(base + Math.sin((x / w) * Math.PI * (1.6 + i * 0.3) + i * 1.7) * amp).toFixed(1)}`;
  return `${d} L${w} 630 L0 630 Z`;
}


/** The app icon (Cilica/apps/desktop/src-tauri/icons/source/icon.svg). Full-bleed for the touch icon, which iOS rounds itself. */
function logo(rounded: boolean) {
  const waves = `<rect width="512" height="512" fill="#faf5ec"/><g transform="scale(8)"><path d="M-32 22.0 Q-16 17 0 22 T32 22 T64 22 T96 22 V64 H-32Z" fill="#efe5d6"/><path d="M-9 29.5 Q7 24.9 23 29.5 T55 29.5 T87 29.5 T119 29.5 V64 H-32Z" fill="#d9c9b4"/><path d="M-18 37.0 Q-2 32.8 14 37 T46 37 T78 37 T110 37 V64 H-32Z" fill="#b5a695"/><path d="M-27 44.5 Q-11 40.7 5 44.5 T37 44.5 T69 44.5 T101 44.5 V64 H-32Z" fill="#8f8275"/><path d="M-4 52.0 Q12 48.6 28 52 T60 52 T92 52 T124 52 V64 H-32Z" fill="#5a524a"/><path d="M-13 59.5 Q3 56.5 19 59.5 T51 59.5 T83 59.5 T115 59.5 V64 H-32Z" fill="#1c1a18"/></g>`;
  if (!rounded) return waves;
  return `<defs><clipPath id="tile"><rect width="512" height="512" rx="116"/></clipPath></defs><g clip-path="url(#tile)">${waves}</g><rect x="3" y="3" width="506" height="506" rx="113" fill="none" stroke="#1c1a18" stroke-opacity="0.14" stroke-width="6"/>`;
}

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffdfa"/><stop offset="1" stop-color="#faf5ec"/></linearGradient></defs>
  <rect width="1200" height="630" fill="url(#sky)"/>
  ${ridges.map((c, i) => `<path d="${wave(i, 1200, 360 + i * 46, 18 - i * 1.5)}" fill="${c}"/>`).join("\n  ")}
  <svg x="80" y="92" width="72" height="72" viewBox="0 0 512 512">${logo(true)}</svg>
  <text x="80" y="246" font-family="Inter" font-size="68" font-weight="700" fill="#1c1a18" letter-spacing="-2.6">Notes that tidy</text>
  <text x="80" y="324" font-family="Inter" font-size="68" font-weight="700" fill="#1c1a18" letter-spacing="-2.6">themselves.</text>
  <text x="80" y="578" font-family="Inter" font-size="28" font-weight="600" fill="#fdfbfa" letter-spacing="-0.6">cilica.si</text>
</svg>`;

const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 512 512">${logo(false)}</svg>`;

const opts = { font: { fontFiles: fonts, loadSystemFonts: false, defaultFontFamily: "Inter" } };
writeFileSync("public/og.png", new Resvg(og, opts).render().asPng());
writeFileSync("public/apple-touch-icon.png", new Resvg(icon, opts).render().asPng());
console.log("Wrote public/og.png and public/apple-touch-icon.png");
