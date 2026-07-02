// Genera los íconos PWA (public/icons/*) desde un SVG maestro con sharp.
// Correr: node scripts/generate-icons.mjs
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'public', 'icons')
mkdirSync(outDir, { recursive: true })

// Sofá de la marca sobre espresso con brillo ámbar. `pad` achica el motivo
// (los maskable necesitan el contenido dentro del 80% central).
// Nota: librsvg (sharp) no soporta transform-origin — se centra a mano:
// el motivo vive en un box local de 40 unidades; su centro visual es (20, 27.5).
function masterSvg({ pad = 0, bg = true } = {}) {
  const k = 11.5 * (1 - pad * 2)
  const tx = 256 - 20 * k
  const ty = 256 - 27.5 * k
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <radialGradient id="glow" cx="50%" cy="38%" r="75%">
      <stop offset="0%" stop-color="#7A4B2E"/>
      <stop offset="55%" stop-color="#4A2C1A"/>
      <stop offset="100%" stop-color="#2A1509"/>
    </radialGradient>
  </defs>
  ${bg ? `<rect width="512" height="512" fill="url(#glow)"/>` : ''}
  <g transform="translate(${tx} ${ty}) scale(${k})">
    <g transform="translate(2,4)" stroke="#F4EDE4" stroke-width="2.4" fill="none" stroke-linecap="round">
      <path d="M6 22V18C6 15 8 13 11 13H25C28 13 30 15 30 18V22"/>
      <path d="M4 22C4 20.5 5 20 6.5 20H29.5C31 20 32 20.5 32 22V25C32 26 31 26.5 30 26.5H6C5 26.5 4 26 4 25V22Z" fill="#F4EDE4" fill-opacity="0.22"/>
      <path d="M9 26.5V29"/>
      <path d="M27 26.5V29"/>
      <path d="M12 17C12 15.5 13 14.5 14.5 14.5" stroke-width="1.4" opacity="0.55"/>
      <path d="M24 17C24 15.5 23 14.5 21.5 14.5" stroke-width="1.4" opacity="0.55"/>
    </g>
    <text x="20" y="38.5" text-anchor="middle" font-family="Georgia, serif" font-size="4.6" font-style="italic" fill="#E8B380">desde 1975</text>
  </g>
</svg>`
}

const jobs = [
  { file: 'icon-192.png', size: 192, svg: masterSvg() },
  { file: 'icon-512.png', size: 512, svg: masterSvg() },
  { file: 'icon-maskable-512.png', size: 512, svg: masterSvg({ pad: 0.11 }) },
  { file: 'apple-touch-icon.png', size: 180, svg: masterSvg() },
]

for (const { file, size, svg } of jobs) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(join(outDir, file))
  console.log('OK', file)
}
