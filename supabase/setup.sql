-- ============================================================
--  TAPIPOCITOS — Setup de base de datos (Supabase)
--  Ejecutar UNA sola vez en: Supabase Dashboard → SQL Editor → New query → Run
--  Es idempotente: se puede volver a correr sin romper nada.
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- PRODUCTOS (catálogo con carrito) ----------
create table if not exists public.products (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  description  text default '',
  material     text default '',
  color        text default '',
  dimensions   text default '',
  price        text default 'Consultar',
  images       text[] default '{}',
  category     text default 'Otros',
  featured     boolean default false,
  created_at   timestamptz default now()
);

-- ---------- TRABAJOS / PROYECTOS (portfolio) ----------
create table if not exists public.projects (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  description    text default '',
  category       text default 'Sofás',
  images         text[] default '{}',
  materials      text[] default '{}',
  client         text default '',
  completed_date text default '',
  featured       boolean default false,
  created_at     timestamptz default now()
);

-- ---------- TESTIMONIOS ----------
create table if not exists public.testimonials (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  text        text default '',
  date        text default '',
  rating      int default 5,
  created_at  timestamptz default now()
);

-- ---------- CONSULTAS / LEADS (privado: solo backend con service_role) ----------
create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text default '',
  phone       text default '',
  subject     text default '',
  message     text default '',
  services    text[] default '{}',
  products    text default '',
  source      text default 'web',
  status      text default 'nuevo',
  created_at  timestamptz default now()
);

-- ---------- AGENDA (privado: recordatorios/entregas del taller) ----------
create table if not exists public.agenda (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  type        text default 'otro',   -- llamar | retirar | entregar | cotizar | otro
  date        date not null,
  time        text default '',       -- 'HH:MM' opcional
  client      text default '',
  phone       text default '',
  notes       text default '',
  done        boolean default false,
  created_at  timestamptz default now()
);

-- ---------- NOTIFICACIONES PUSH (privado: suscripciones + claves VAPID) ----------
alter table public.agenda add column if not exists notified boolean default false;

create table if not exists public.push_subscriptions (
  id            uuid primary key default gen_random_uuid(),
  endpoint      text unique not null,
  subscription  jsonb not null,
  created_at    timestamptz default now()
);

-- Claves VAPID auto-generadas por /api/push la primera vez (fila única id=1).
create table if not exists public.push_config (
  id             int primary key default 1,
  vapid_public   text not null,
  vapid_private  text not null,
  created_at     timestamptz default now()
);

-- ---------- RLS: lectura pública, escritura solo service_role ----------
-- El service_role (usado por las funciones /api) OMITE RLS, así que sólo
-- habilitamos la LECTURA anónima. No creamos políticas de escritura pública
-- a propósito: nadie puede escribir con la anon key, sólo el backend.
alter table public.products     enable row level security;
alter table public.projects     enable row level security;
alter table public.testimonials enable row level security;
-- leads y agenda NO tienen políticas públicas a propósito: solo el backend (service_role) puede leer/escribir.
alter table public.leads        enable row level security;
alter table public.agenda      enable row level security;
alter table public.push_subscriptions enable row level security;
alter table public.push_config       enable row level security;

drop policy if exists "public read products" on public.products;
create policy "public read products" on public.products for select using (true);

drop policy if exists "public read projects" on public.projects;
create policy "public read projects" on public.projects for select using (true);

drop policy if exists "public read testimonials" on public.testimonials;
create policy "public read testimonials" on public.testimonials for select using (true);

-- ---------- STORAGE: bucket público para imágenes ----------
insert into storage.buckets (id, name, public)
values ('tapipocitos-images', 'tapipocitos-images', true)
on conflict (id) do update set public = true;

drop policy if exists "public read tapipocitos images" on storage.objects;
create policy "public read tapipocitos images" on storage.objects
  for select using (bucket_id = 'tapipocitos-images');

-- Listo. Las escrituras (crear/editar/borrar/subir imágenes) las hacen las
-- funciones serverless con la SERVICE_ROLE_KEY, que ya omite RLS.
