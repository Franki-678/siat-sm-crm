-- ─────────────────────────────────────────────────────────────────────────────
-- SIAT-SM · Migración inicial — Tabla consultas
-- Proyecto: xysledaqzlelvppdkbvp
-- ─────────────────────────────────────────────────────────────────────────────
--
-- Nota de privacidad:
--   El DNI y el nombre del paciente NO se almacenan en esta tabla.
--   Solo se persiste el sesion_id (opaco) y las variables clínicas + resultado.

create table if not exists public.consultas (
  id              uuid        primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),

  -- Identificador de sesión opaco (no vinculable a persona)
  sesion_id       text        not null,

  -- Variables clínicas (escala ENSE 2017)
  sexo            smallint    not null check (sexo between 1 and 2),
  edad            smallint    not null check (edad between 15 and 69),
  nivel_estudios  smallint    not null check (nivel_estudios between 2 and 9),
  tabaquismo      smallint    not null check (tabaquismo between 1 and 4),
  cigarrillos_dia smallint    not null check (cigarrillos_dia between 0 and 7),
  actividad_fisica smallint   not null check (actividad_fisica between 1 and 4),
  alcohol         smallint    not null check (alcohol between 1 and 9),
  imc_categoria   smallint    not null check (imc_categoria between 1 and 4),
  codigo_ine      char(5)     not null,

  -- Resultado del motor de decisión
  p_base          numeric(6,4) not null,
  ivsm_score      numeric(6,4),
  riesgo_total    numeric(6,4) not null,
  categoria       text         not null,
  tipo_alerta     text         not null,
  municipio       text,

  -- Meta
  duracion_ms     integer
);

-- Índices útiles para el dashboard admin
create index if not exists consultas_created_at_idx on public.consultas (created_at desc);
create index if not exists consultas_tipo_alerta_idx on public.consultas (tipo_alerta);
create index if not exists consultas_codigo_ine_idx  on public.consultas (codigo_ine);

-- Row Level Security: solo el anon key puede insertar, nobody puede leer sin autenticar
alter table public.consultas enable row level security;

-- Política: cualquier request anon puede insertar (el formulario público)
create policy "insert_anon"
  on public.consultas
  for insert
  to anon
  with check (true);

-- Política: solo el rol authenticated (admin logueado) puede leer
create policy "select_authenticated"
  on public.consultas
  for select
  to authenticated
  using (true);

comment on table public.consultas is
  'Registro de consultas SIAT-SM. Sin PII — DNI y nombre nunca se persisten.';
