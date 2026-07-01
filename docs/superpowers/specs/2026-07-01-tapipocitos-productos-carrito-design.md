# Tapipocitos — Productos, Carrito y Admin real (spec)

Fecha: 2026-07-01
Estado: aprobado por el usuario (Brian)

## Objetivo
Dejar el sitio de Tapipocitos **funcional, sin errores y listo para producción en Vercel**, con:
1. **Admin** para cargar **Productos** (y Trabajos y Testimonios) que **persisten en la base real** (Supabase).
2. **Carrito de presupuesto** para el cliente: agrega productos, persiste entre recargas, y pide presupuesto por **WhatsApp** o **formulario**.
3. **Animaciones** de scroll y aparición de items consistentes en todo el sitio.

## Decisiones del usuario
- Carrito = **carrito de presupuesto** (no e-commerce con pago).
- Persistencia admin = **base de datos real** (Supabase) vía funciones serverless seguras.
- Destino = **producción en Vercel**.
- Estructura = **Productos** (con carrito) y **Trabajos** (portfolio) **separados**, ambos en el admin.

## Stack actual
Vite + React 19 + TS + Tailwind v4 + shadcn/ui + framer-motion. Supabase configurado en `.env.local`
(URL, anon key, service role key, ADMIN_PASSWORD). Deploy target: Vercel.

## Problema raíz detectado
`src/lib/store.tsx` hace todas las escrituras contra `/api/*`, pero **no existe carpeta `/api`** →
el admin no guarda nada. Los reads sí funcionan (Supabase directo con anon). `vercel.json` reescribe
`/api` a sí mismo (no-op).

## Arquitectura objetivo

### Backend (persistencia real)
- Lógica común en `api/_lib/*` (framework-agnóstica: recibe method/query/body → {status, json}),
  usando `@supabase/supabase-js` con **service role key** (solo servidor).
- Adaptadores Vercel: `api/products.ts`, `api/projects.ts`, `api/testimonials.ts`, `api/upload.ts`, `api/auth.ts`.
- **Dev local:** plugin de Vite que monta los mismos handlers en `/api/*` para que `npm run dev` funcione
  igual que en Vercel (sin depender de `vercel dev`).
- Reads siguen client-side (anon, rápido). Writes vía serverless.
- Supabase: tablas `products`, `projects`, `testimonials` con schema correcto + RLS (select anónimo,
  escritura solo service-role). Bucket de Storage para imágenes. Crear/reparar si falta.

### Carrito ("Mi presupuesto")
- `CartProvider` (context) + `localStorage` (`tapipocitos_cart`). add/remove/clear/count, de-dup por id.
- `Productos` (Products.tsx cableado): cada card con **"Agregar al carrito"** + **"Consultar por WhatsApp"**.
- Navbar: badge con cantidad → Sheet "Mi presupuesto" (lista, quitar, CTAs).
- CTAs del carrito: **Pedir presupuesto por WhatsApp** (arma mensaje con la lista) y **Por formulario**
  (Contact pre-cargado con la lista).

### Estructura de vistas
- Público: `home | about | services | products | gallery(Trabajos) | contact`.
- Nav: Inicio · Nosotros · Servicios · **Productos** · **Trabajos** · Contacto (+ carrito).
- Admin: `dashboard | products | projects(Trabajos) | testimonials`.

### Animaciones
- Componente `Reveal` (framer-motion whileInView, once, stagger) aplicado consistentemente.
- Duraciones/easing del PRD. Respeta `prefers-reduced-motion`.

## Fases
0. Baseline: build/typecheck, dev server, estado real de Supabase (tablas/RLS/bucket).
1. Backend serverless + plugin dev + schema/RLS/storage.
2. Carrito + Productos + Navbar + Contact prefill.
3. Admin Productos (re-cablear AdminProducts) + menú admin.
4. Pasada de animaciones.
5. Limpieza, build verde, verificación en navegador, env vars Vercel.

## Criterios de "listo"
- `npm run build` sin errores; sin errores en consola del navegador.
- Admin: crear/editar/borrar Producto persiste y se ve en el sitio público.
- Carrito persiste entre recargas; WhatsApp y formulario reciben la lista.
- Animaciones consistentes; responsive mobile OK.
- Deploy-ready en Vercel (env vars documentadas).
