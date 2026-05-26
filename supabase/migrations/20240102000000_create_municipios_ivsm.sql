-- Tabla de municipios con Índice de Vulnerabilidad Socio-Medioambiental (IVSM)
-- 8.131 municipios españoles con score normalizado [0,1]
-- Fuente: ETL propio sobre datos MITECO + INE

create table if not exists public.municipios_ivsm (
  codigo_ine      text        primary key,         -- '01001', '28079', etc.
  nombre          text        not null,
  aire_pm         numeric(8,3),                    -- PM2.5 µg/m³ media anual
  ivsm_score      numeric(6,4) not null,           -- Índice normalizado [0,1]
  ivsm_categoria  text        not null,            -- 'Riesgo Bajo' | 'Riesgo Medio' | 'Riesgo Alto'
  fuente_aire     text
);

-- Índice para búsqueda rápida por código (PK ya indexa, pero por claridad)
create index if not exists idx_municipios_ivsm_codigo on public.municipios_ivsm (codigo_ine);

-- RLS: lectura pública (datos medioambientales, no PII)
alter table public.municipios_ivsm enable row level security;

create policy "select_anon_municipios"
  on public.municipios_ivsm
  for select
  to anon
  using (true);

create policy "select_authenticated_municipios"
  on public.municipios_ivsm
  for select
  to authenticated
  using (true);
