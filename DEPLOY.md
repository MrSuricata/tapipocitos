# Tapipocitos — Puesta en producción

Guía corta para dejar el sitio funcionando en local y en Vercel.

## 1. Base de datos (una sola vez)

El sitio usa **Supabase**. Hay que crear las tablas y el bucket de imágenes:

1. Entrá al proyecto de Supabase (el que está en `.env.local` → `VITE_SUPABASE_URL`).
2. Abrí **SQL Editor → New query**.
3. Pegá y ejecutá el contenido de [`supabase/setup.sql`](supabase/setup.sql).

Eso crea las tablas `products`, `projects`, `testimonials`, activa RLS (lectura pública,
escritura solo con la clave de servicio) y crea el bucket público `tapipocitos-images`.

> Nota: este proyecto de Supabase no está en la cuenta conectada por MCP, así que este paso
> lo tenés que correr vos desde el panel de Supabase. Es copy-paste, tarda 5 segundos.

## 2. Variables de entorno

Ya están en `.env.local` para desarrollo local. En **Vercel** hay que cargarlas en
**Project → Settings → Environment Variables** (Production + Preview):

| Variable | Para qué | Tipo |
|---|---|---|
| `VITE_SUPABASE_URL` | URL del proyecto Supabase | Cliente (build) |
| `VITE_SUPABASE_ANON_KEY` | Lectura pública de datos | Cliente (build) |
| `SUPABASE_SERVICE_ROLE_KEY` | Escrituras del admin (funciones `/api`) | Servidor |
| `ADMIN_PASSWORD` | Contraseña del panel admin | Servidor |

⚠️ La `SUPABASE_SERVICE_ROLE_KEY` **nunca** se expone al navegador: solo la usan las
funciones serverless de `/api`.

## 3. Desarrollo local

```bash
npm install
npm run dev
```

Corre en `http://localhost:5000`. El servidor de dev ahora también sirve `/api/*`
(productos, trabajos, testimonios, subida de imágenes y login) usando las mismas funciones
que en Vercel, así que el admin guarda de verdad también en local.

## 4. Deploy en Vercel

```bash
npm run build   # verifica que compila
```

Push al repo conectado a Vercel (o `vercel --prod`). Vercel detecta:
- El front (Vite) → `dist/`
- Las funciones en `/api/*.ts` (los archivos que empiezan con `_` como `api/_lib` no son endpoints).

## 5. Panel admin

- URL: `https://tu-dominio/#admin`
- Contraseña: la que pusiste en `ADMIN_PASSWORD` (por defecto en `.env.local`).
- Secciones: **Productos** (catálogo con carrito), **Trabajos** (portfolio), **Testimonios**.

## 6. Carrito de presupuesto

- El cliente entra a **Productos**, toca **Agregar al presupuesto** (se guarda aunque recargue)
  o **Consultar por WhatsApp** en cada producto.
- Desde el ícono de carrito en la barra, ve su lista y pide presupuesto por **WhatsApp**
  (con el detalle armado) o por el **formulario** (pre-cargado).
- El número de WhatsApp está en `src/lib/cart.tsx` (`WHATSAPP_NUMBER`).
