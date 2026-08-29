# TAPIPOCITOS

Sitio y sistema de gestión de **TAPIPOCITOS**, tapicería familiar de Montevideo (Uruguay) desde 1975.

**Producción:** https://tapipocitos.vercel.app · **Panel:** `/admin`

---

## Qué incluye

**Sitio público** — portada cinematográfica, catálogo de productos con carrito de presupuesto,
portfolio de trabajos, servicios, testimonios, FAQ y contacto. Instalable como app (PWA).

**Panel de gestión** (`/admin`, para los dueños del taller):

| Sección | Para qué |
|---|---|
| Agenda | Recordatorios del taller (llamar / retirar / entregar / cotizar) con avisos push al celular |
| Facturar | Presupuestos, facturas y órdenes de entrega → PDF con membrete, envío por WhatsApp |
| Consultas | Los pedidos que llegan de la web, con respuesta por WhatsApp en un toque |
| Productos / Trabajos / Testimonios | Contenido del sitio, con carga de fotos |
| Personalizar | Color del sitio y textos de la portada |

---

## Documentación

| Documento | Para qué |
|---|---|
| **[docs/DISENO.md](docs/DISENO.md)** | **Brief de diseño**: mapa de archivos, sistema de temas, patrones de movimiento y trampas técnicas. **Leer antes de tocar cualquier cosa visual.** |
| [HANDOFF.md](HANDOFF.md) | Estado técnico, arquitectura, gotchas de backend y checklist de entrega |
| [DEPLOY.md](DEPLOY.md) | Variables de entorno y despliegue |
| [PRD.md](PRD.md) | Requerimientos originales del producto |

---

## Desarrollo

```bash
npm install
```

```bash
npm run dev
```

```bash
npx tsc -p tsconfig.json --noEmit
```

```bash
npm run build
```

Dev server en `http://localhost:5000`. El typecheck y el build tienen que dar exit 0 antes de
commitear.

**Stack:** Vite · React 19 · TypeScript · Tailwind v4 · shadcn/ui · framer-motion · Supabase ·
funciones serverless en Vercel.

**Deploy:** push a `main` → Vercel publica automáticamente.
