# DISEÑO — Brief de rediseño de TAPIPOCITOS

> **Para quién es este documento:** cualquier diseñador (humano o Claude Design) que vaya a
> rediseñar la webapp. Es el mapa de qué tocar, qué respetar y dónde están las trampas.
> Última actualización: agosto 2026.

---

## 1. Qué es esto

Webapp de **TAPIPOCITOS**, tapicería familiar de Montevideo (Uruguay), tres generaciones desde 1975.
Dos productos en uno:

| Superficie | Quién la usa | Objetivo |
|---|---|---|
| **Sitio público** | Clientes potenciales | Que confíen y pidan presupuesto |
| **Panel `/admin`** | Los dueños del taller (60+ años, celular) | Operar el negocio sin fricción |

**Regla de oro del rediseño:** son dos lenguajes distintos. El sitio público puede (y debe) ser
audaz y editorial. El admin tiene que ser **grande, claro y a prueba de dedos** — ahí la belleza
es la legibilidad. No unifiques ambos bajo una misma estética "linda".

Dirección actual: **atelier cinematográfico** — cuero, madera, espresso, luz cálida de taller.
Fotografía real (nada de stock ni ilustraciones genéricas), tipografía serif editorial, movimiento
pausado. Lo que el rediseño debe superar, no repetir: cualquier cosa que huela a plantilla.

---

## 2. Identidad actual (punto de partida)

### Paleta

| Rol | Hex | Uso |
|---|---|---|
| Espresso profundo | `#1A0F08` | Fondo del hero y secciones inmersivas |
| Espresso marca | `#2C1810` | Footer, botones primarios, membretes PDF |
| Crema (papel) | `#F5F0EB` | Fondo general del sitio |
| Crema texto | `#F5EDE2` | Texto sobre fondos oscuros |
| Arena | `#C4A882` | Texto secundario sobre oscuro |
| **Acento cuero** | `#C97A40` | Acento principal — **variable, ver §4** |
| Acento suave | `#E8B380` | Realces sobre oscuro |
| Acento fuerte | `#B56A33` | Hover del acento |
| Lino (marco foto) | `#E9E0D4` | Fondo detrás de las fotos mientras cargan |
| WhatsApp | `#1FAF5A` | Único color ajeno a la marca, intencional |

### Tipografía

- **Playfair Display** — display/serif editorial (títulos, nombres de producto). El alma de la marca.
- **Open Sans** — cuerpo.
- **Inter** — botones y UI.
- **Poppins** — solo panel admin (más neutra y legible para trabajo).

Se cargan desde Google Fonts en `index.html`. Si cambiás de familias, cambiá **ahí** y en
`src/index.css` (`@layer base` define qué familia usa cada elemento).

### Materia (lo que da carácter)

Texturas reales en `public/fotos/`: `leather-texture.jpg`, `fabric-texture.jpg`, y grano de película
(`.film-grain` en `index.css`, SVG feTurbulence inline). Vale la pena conservar esta capa táctil —
es lo que separa la web de una plantilla.

---

## 3. Mapa de archivos — QUÉ TOCAR

### 3.1 Núcleo del sistema visual (empezar acá siempre)

| Archivo | Qué contiene | Prioridad |
|---|---|---|
| `src/index.css` (633 líneas) | **El corazón.** Variables de marca, tokens de color, `@theme` de Tailwind y ~35 clases utilitarias propias (`.glass`, `.glass-dark`, `.film-grain`, `.warm-mesh`, `.card-lift`, `.cta-primary`, `.text-gradient-warm`, `.hero-kenburns`, `.marquee-track`, `.shadow-soft/float`, `.bg-orb`, `.side-label`, `.admin-zoom`…) | 🔴 Crítica |
| `src/lib/settings.ts` | Los 4 temas de color que el cliente elige desde el admin (`THEMES`: accent + soft + strong + ground) y `applyTheme()` | 🔴 Crítica |
| `index.html` | Carga de fuentes, `theme-color`, metas de PWA, preload del hero | 🟠 Alta |
| `src/lib/constants.ts` | `DESIGN_TOKENS` heredados (colores fríos, escala tipográfica antigua) — **ver deuda en §8** | 🟡 Revisar |
| `src/styles/theme.css` + `src/main.css` | Base de shadcn/Radix. Casi nunca hay que tocarlos; el diseño propio vive en `index.css` | ⚪ Rara vez |

**Cadena de importación real:** `main.tsx` → `main.css` → `theme.css` → `index.css`.
`index.css` es el último, así que **gana la cascada**. Ese es el lugar correcto para escribir.

### 3.2 Superficie pública — orden real de la home

La home renderiza en este orden (ver `src/App.tsx`):

| # | Componente | Archivo (líneas) | Qué es hoy |
|---|---|---|---|
| 1 | Hero | `src/components/Hero.tsx` (258) | Fotograma a pantalla completa, Ken Burns, grano, título editorial a la izquierda, stats abajo |
| 2 | PhotoShowcase | `src/components/PhotoShowcase.tsx` (180) | Tira horizontal de fotos del taller |
| 3 | Marquee | `src/components/Marquee.tsx` (44) | Cinta tipográfica serif infinita con los oficios |
| 4 | Services | `src/components/Services.tsx` (517) | Los 4 servicios, con detalle expandible |
| 5 | About | `src/components/About.tsx` (498) | Historia familiar + grandes proyectos |
| 6 | TrabajosDestacados | `src/components/TrabajosDestacados.tsx` (201) | Selección de portfolio en la home |
| 7 | Testimonials | `src/components/Testimonials.tsx` (109) | Sección oscura inmersiva, textura de cuero |
| 8 | Faq | `src/components/Faq.tsx` (83) | Acordeón |
| 9 | Contact | `src/components/Contact.tsx` (548) | Formulario + mapa real |

Vistas aparte (no en la home):

- `src/components/Products.tsx` (825) — **catálogo con precio y carrito**
- `src/components/Gallery.tsx` (668) — **portfolio de trabajos, sin precio**
- `src/components/Navbar.tsx` (247) — nav adaptativo claro/oscuro + engranaje al admin
- `src/components/Footer.tsx` (169)

Piezas transversales (tocar con cuidado, se usan en todos lados):

- `src/components/FilterTabs.tsx` — tabs subrayados con contador (Productos y Trabajos)
- `src/components/SafeImage.tsx` — `<img>` con fallback degradado si la foto no carga
- `src/components/Reveal.tsx`, `CountUp.tsx`, `ScrollProgress.tsx`, `BackgroundDecor.tsx`,
  `WhatsAppFab.tsx`, `CartSheet.tsx`

### 3.3 Panel admin (`/admin`)

| Archivo (líneas) | Qué es |
|---|---|
| `src/components/admin/AdminLayout.tsx` (159) | Shell, sidebar, menú (orden de las secciones) |
| `AdminAgenda.tsx` (700) | **La pantalla de entrada.** Calendario, alta rápida, vencidos, completados |
| `AdminInvoice.tsx` (562) | Presupuestos/facturas → **PDF con membrete** (el diseño del PDF también vive acá, en jsPDF) |
| `AdminProjects.tsx` (554) / `AdminProducts.tsx` (465) | Alta y edición con foto |
| `AdminLeads.tsx` (251) | Consultas + responder por WhatsApp |
| `AdminSettings.tsx` (173) | Donde el cliente elige tema y textos del hero |
| `AdminDashboard.tsx` (203), `AdminTestimonials.tsx` (186), `AdminLogin.tsx` (102) | Resto |

**Constraint del admin:** todo el panel corre con `html.admin-zoom` (base 18 px en vez de 16 px,
definido en `index.css`). Cualquier rediseño hereda esa escala — no la anules.

### 3.4 Assets

- `public/fotos/` — **49 fotos reales, 7,7 MB**, organizadas en `sofas/`, `sillones/`, `sillas/`,
  `restauraciones/`, `taller/`, `familia/`. **Este es el mayor activo visual del proyecto.**
  Un rediseño que no las use en grande está desperdiciando lo mejor que hay.
- `public/fotos/leather-texture.jpg`, `fabric-texture.jpg` — texturas de fondo.
- `public/icons/` — íconos PWA (se regeneran con `node scripts/generate-icons.mjs`).
- `public/favicon.svg` — logo sofá de línea. El logotipo vive **como SVG inline** en
  `Navbar.tsx` (`SofaLogo`) y `Footer.tsx`.
- Las fotos que suben los dueños desde el admin van a **Supabase Storage**, no al repo.

### 3.5 Qué NO tocar (lógica, no diseño)

`src/lib/{auth,cart,store,supabase,push,agenda,leads,undo}.ts`, todo `api/`, `supabase/setup.sql`,
`vercel.json`, y `src/components/ui/**` (primitivas shadcn: cambiá el token, no el primitivo).

---

## 4. Sistema de temas — LO MÁS IMPORTANTE DE ESTE DOCUMENTO

El cliente puede cambiar el color del sitio desde el admin (Personalizar). Eso significa que
**el acento y el fondo NO son constantes: son variables.**

```css
--brand-accent         /* acento principal    */
--brand-accent-soft    /* realce sobre oscuro */
--brand-accent-strong  /* hover / profundidad */
--brand-ground         /* el "papel" del sitio */
```

- Se definen en `src/index.css` (`:root`) y las reescribe `applyTheme()` en `src/lib/settings.ts`.
- `--accent` de Tailwind **sigue** a `--brand-accent`, así que `text-accent` / `bg-accent` se
  re-pintan solos.
- Los 4 temas disponibles: **Cuero** (default), **Oliva**, **Vino**, **Petróleo**.

### Reglas duras

1. **Nunca escribas `#C97A40` (ni sus variantes) a mano** en un componente. Usá
   `var(--brand-accent)`, `text-accent` o `bg-[var(--brand-accent)]`. Si hardcodeás, ese elemento
   queda huérfano cuando el cliente cambia de tema.
2. Los **espresso oscuros son constantes de marca** (`#1A0F08`, `#2C1810`) — no siguen al tema, a
   propósito. Si tu rediseño quiere que también cambien, agregá una variable nueva y actualizá
   los 4 temas en `settings.ts`.
3. Al agregar un tema, completá **las cuatro** claves (accent/soft/strong/ground) o el fondo
   quedará desalineado del acento.

---

## 5. Lenguaje de movimiento actual

Librería: **framer-motion**. Lo que está implementado hoy:

- **Reveal difuminado (blur-focus)** — patrón principal en Productos y Trabajos: la foto entra con
  `opacity 0 + blur(18px) + deriva lateral ±30px + scale 1.1` y se enfoca en 1,35 s; el texto entra
  después (delay 0.4 s) con su propio `blur(6px)→0`. Ver `rowZoomVariants` / `sideTextVariants` en
  `Products.tsx` y `Gallery.tsx`.
- **Filas editoriales alternadas** — foto 7/12 + relato 5/12, alternando lado; en mobile apila.
- **Ken Burns** en el hero (`.hero-kenburns`), **marquee** infinito, **grano** (`.film-grain`),
  **orbes** cálidos de fondo (`.bg-orb`, `BackgroundDecor.tsx`).
- Curvas en uso: `CURTAIN_EASE [0.65,0,0.35,1]`, `ZOOM_EASE [0.22,1,0.36,1]`,
  `SOFT_EASE [0.33,1,0.68,1]`, y `--ease-apple` en CSS.

**Obligatorio:** todo movimiento respeta `prefers-reduced-motion` (via `useReducedMotion()` de
framer o la media query en `index.css`). Si agregás animación, agregá su escape.

---

## 6. Restricciones no negociables

1. **Mobile primero de verdad.** Los dueños y buena parte de los clientes entran desde el celular.
   Todo se verifica a 375 px: sin scroll horizontal, targets ≥ 40 px.
2. **PWA instalable.** Hay app en pantalla de inicio: cuidado con headers fijos y `100vh`
   (usá `dvh` donde importe). `theme-color` en `index.html` acompaña al fondo.
3. **Accesibilidad**: contraste mínimo 4.5:1, foco visible, `aria-label` en botones de ícono.
4. **Las fotos mandan.** Nada de overlays oscuros pesados encima de las fotos del taller: ya se
   probó y ahoga las imágenes. Si necesitás legibilidad sobre foto, usá degradado local y suave.
5. **Peso**: las fotos ya son 7,7 MB. Cualquier asset nuevo, optimizado; `loading="lazy"` siempre.
6. El sitio se ve **solo en claro** (no hay dark mode de sitio público, y no hace falta).

---

## 7. Trampas técnicas (esto costó sangre — leelo antes de tocar)

1. **`var()` NO funciona en atributos de presentación SVG.** `fill="var(--x)"` se ignora en
   silencio; hay que usar `style={{ fill: 'var(--x)' }}`.
2. **`custom` de framer-motion NO se hereda del padre a los hijos.** Si una variant usa
   `custom` (dirección, índice), hay que pasarle `custom={...}` a **cada** `motion.*` hijo.
3. **`whileInView` con `once` puede dejar elementos sin revelar** si el usuario salta el scroll
   (tecla End, anclas). Solución en uso: `viewport={{ margin: '10000px 0px -60px 0px' }}`.
4. **Un `filter` estático en `style` es pisado por el `filter` animado de framer.** Si animás
   `filter`, meté también el grado de imagen (saturate/contrast) dentro de la animación.
5. **Pseudo-elementos que sobresalen causan overflow horizontal en mobile.** Le pasó a
   `.warm-mesh` (su `::before` sobresale 25%): necesita `overflow: hidden` en el padre.
6. **En layouts masonry hay que reservar altura** (aspect-ratio), o las animaciones de entrada se
   disparan todas juntas en el primer frame, antes de que carguen las fotos.
7. **`html`/`body` deben tener fondo explícito** o cualquier hueco entre vistas parpadea en blanco.
8. **El admin es lazy-loaded**: si envolvés todo en un solo `<Suspense>`, cambiar de sección
   desmonta el layout entero y produce un flash blanco. El `Suspense` va **dentro**, en el área de
   contenido, y los cambios de vista dentro de `startTransition`.

---

## 8. Deuda de diseño conocida (oportunidades del rediseño)

- **`DESIGN_TOKENS` en `src/lib/constants.ts` está desalineado con la marca**: define títulos en
  `#1F2937` y textos en `#374151` (grises fríos de plantilla) mientras toda la identidad es cálida.
  Lo usan 8 archivos. **Unificarlo con las variables CSS cálidas es la mejora estructural más
  grande disponible.**
- Los `ProductPlaceholder` / `ProjectPlaceholder` (siluetas SVG sobre degradados de colores por
  categoría) son de la época anterior y **no combinan con la dirección actual**. Con fotos reales
  casi nunca se ven; convendría rediseñarlos o reemplazarlos por un lino tramado neutro.
- Hay `Reveal.tsx` (patrón viejo) conviviendo con las variants nuevas de framer: unificar.
- Las filas editoriales lucen con catálogo curado; **con 30+ productos la página se hace larga** →
  hará falta paginación o vista dual.
- `Products.tsx` (825) y `Gallery.tsx` (668) son grandes y comparten mucho: los tiles/filas piden
  extraerse a un componente común.

---

## 9. Cómo probar lo que hacés

```bash
npm install
npm run dev
```

```bash
npx tsc -p tsconfig.json --noEmit
```

```bash
npm run build
```

El dev server queda en `http://localhost:5000`. El typecheck y el build tienen que dar exit 0
antes de commitear.

Checklist mínimo antes de dar por bueno un cambio visual:

1. Desktop y **375 px** (sin scroll horizontal).
2. **Los 4 temas** (Personalizar en el admin) — que nada quede con el acento viejo.
3. Con y sin fotos cargadas (los placeholders también son diseño).
4. `prefers-reduced-motion` activado.
5. La consola del navegador limpia.

Deploy: push a `main` → Vercel publica solo. Producción: https://tapipocitos.vercel.app

---

## 10. Resumen para el diseñador apurado

> Tocá **`src/index.css`** (sistema) y **`src/lib/settings.ts`** (temas) primero. Después las
> secciones públicas una por una. Usá **variables, nunca hexadecimales**. Poné las **49 fotos
> reales** al frente y en grande. Movimiento pausado, no efectista. El admin es otra cosa:
> grande, claro, para manos de taller. Y antes de tocar animaciones o SVG, leé la §7.
