# Handoff — Tapipocitos (para próxima sesión)

_Última actualización: 2026-07-02._

## Rediseño atelier cinematográfico (2026-07-02)
- **Hero nuevo**: foto real del Chesterfield en retapizado a pantalla completa, gradientes espresso, viñeta, grano de película (`.film-grain`), Ken Burns (`.hero-kenburns`), tipografía editorial alineada a la izquierda (Playfair 800), etiqueta lateral vertical, stats sobre línea inferior. Sin tijeras/agujas flotantes.
- **Navbar adaptativo**: claro (crema) sobre el hero oscuro de la home, glass blanco al scrollear (flag `onDark` en Navbar.tsx).
- **Marquee** (`src/components/Marquee.tsx`): cinta tipográfica serif infinita entre PhotoShowcase y Services.
- **Testimonios**: sección oscura inmersiva con `leather-texture.jpg` de fondo, cards `glass-dark`, citas en serif crema.
- **Fix importante**: `.warm-mesh` ahora tiene `overflow:hidden` — su `::before` (inset -25%) causaba overflow horizontal y zoom-out en mobile (bug que estaba en prod).
- Consulta de prueba "PRUEBA (borrala)" **ya borrada** de prod vía DELETE /api/leads.

## PWA + Agenda (2026-07-02, segunda tanda)
- **PWA instalable**: `public/manifest.webmanifest` (iconos en `public/icons/`, shortcut a /admin), `public/sw.js` (NUNCA cachea `/api/` ni `/_vercel/`; navegación network-first con shell offline; estáticos cache-first), registro solo en producción (guard por hostname en index.html). Iconos se regeneran con `node scripts/generate-icons.mjs` (sharp, devDep).
- **Agenda del taller** (admin): `AdminAgenda.tsx` — calendario mensual custom (sin libs de fechas), alta rápida con tipos (llamar/retirar/entregar/cotizar/otro), vencidos en rojo, próximos, marcar hecho, links tel:/WhatsApp. Backend `api/agenda.ts` → `agendaHandler` (TODOS los métodos requieren header `x-admin-password`). Tabla `agenda` agregada a `supabase/setup.sql` (RLS sin políticas públicas).
- **PENDIENTE DEL USUARIO**: re-correr `supabase/setup.sql` (idempotente) en el SQL Editor del dashboard para crear la tabla `agenda`. Hasta entonces la sección Agenda muestra una tarjeta de error con esa instrucción.

## Estado actual — TODO LIVE ✅
Sitio en producción: **https://tapipocitos.vercel.app** — admin en **/admin** (pass `tapipocitos2024`).
Repo GitHub: `MrSuricata/tapipocitos` (rama `main`). Deploy: **push a `main` → Vercel auto-deploya prod**.

Funciona y verificado en producción:
- Landing estilo Apple-premium cálido (glass, gradientes, orbes de fondo animados, Reveal, CountUp, WhatsApp FAB, barra de scroll, formulario de contacto en la home).
- **Productos** con carrito de presupuesto (localStorage), consulta por WhatsApp, pedir presupuesto.
- **Trabajos** (portfolio) + **Nosotros** (historia + grandes proyectos) + **Servicios** + **Testimonios** + **FAQ** + **Contacto** (con mapa de Google real).
- **Admin** remasterizado (tipografía Poppins, glass, sidebar premium) con secciones: Dashboard, Productos, Trabajos, Testimonios, **Consultas**.
- **Captura de consultas (leads)**: el formulario guarda en Supabase tabla `leads`; se ven en Admin → Consultas. Probado: POST /api/leads → 201, GET (con pass) → 200. ✅
- SEO: JSON-LD LocalBusiness + favicon.svg + og:image + canonical. Admin **lazy-loaded** (bundle main ~907kB).

## Cosas que quedan / a chequear
- Hay una consulta de prueba **"PRUEBA (borrala)"** en Admin → Consultas: borrarla.
- **Analytics**: el usuario activó Web Analytics en Vercel. Se arregló el rewrite (excluye `/_vercel/`, commit c28467a) para que el script cargue. Verificar que la consola quede sin errores tras ese deploy.
- Ideas propuestas y NO hechas aún: galería de varias fotos por producto/trabajo; panel de estadísticas de visitas en el admin; limpiar deps pesadas sin usar (requiere `npm uninstall` local — no se pudo desde el entorno sin red).

## Arquitectura (lo mínimo para no romper nada)
- Vite + React 19 + TS + Tailwind v4 + shadcn/ui + framer-motion.
- **Datos**: Supabase (`products`, `projects`, `testimonials`, `leads`). Reads públicos = cliente con anon key. Writes + leads = **funciones serverless `api/*.ts`** con SERVICE_ROLE_KEY. La misma lógica (`api/_lib/handlers.ts`) se sirve en `npm run dev` vía plugin en `vite.config.ts`.
- Env vars (en Vercel + `.env.local`): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`.
- Proyecto Supabase: ref `vbfjtrfukilmgtepvfie` — **NO está en la cuenta del MCP de Supabase**, así que el schema se corre a mano con `supabase/setup.sql` (idempotente) desde el dashboard. Si se pausa (plan free), resumir desde el dashboard.

## GOTCHAS (leer antes de tocar `/api` o `vercel.json`)
1. **ESM**: `package.json` tiene `"type":"module"`. Los imports relativos en `api/*.ts` DEBEN llevar `.js` (ej. `./_lib/handlers.js`). Si no → `FUNCTION_INVOCATION_FAILED` en Vercel. El dev de Vite NO lo detecta.
2. **SPA rewrite** en `vercel.json`: `/((?!api/|_vercel/).*) → /index.html`. NO quitar las exclusiones `api/` (rompe backend) ni `_vercel/` (rompe analytics). Para agregar rutas cliente nuevas, ya andan solas (todo cae en index.html).
3. **Leads privados**: GET/DELETE `/api/leads` requieren header `x-admin-password`. La pass se guarda en localStorage (`tapipocitos_pw`) al loguear (`src/lib/auth.ts` → `getAdminPassword()`).

## Cómo verificar (el entorno de Claude no puede sacar screenshots ni ejecutar rAF: navegador headless)
- Build: `npm run build` (debe dar exit 0). Typecheck: `npx tsc -p tsconfig.json --noEmit`.
- Verificar prod: MCP de Vercel (`list_deployments`, `web_fetch_vercel_url`) o el MCP de Playwright (`browser_navigate` + `browser_evaluate` con `fetch(...)`) contra https://tapipocitos.vercel.app.
- Para probar el DOM local: `npm run dev` (puerto 5000) — pero el Node del entorno no tiene red a Supabase, así que los writes se prueban contra prod.

## Deploy paso a paso
```
git add -A && git commit -m "..." && git push origin main
```
Vercel deploya solo. Confirmar con el MCP de Vercel (proyecto `prj_yDImU9BAFgc0HmdnUUinbGaZg7C9`, team `team_iJoIcAEL7ALPNl7gkk6wcsis`).
