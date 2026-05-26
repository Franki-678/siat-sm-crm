"""
upload_ivsm.py — Carga el CSV IVSM_Definitivo.csv en Supabase (tabla municipios_ivsm).

Ejecutar UNA VEZ después de aplicar la migración SQL:
  supabase/migrations/20240102000000_create_municipios_ivsm.sql

Requisitos:
  pip install supabase

Uso:
  python scripts/upload_ivsm.py
"""

import csv, os, sys, time

# ── Configuración ──────────────────────────────────────────────────────────────
CSV_PATH = r"C:\Users\PITON\OneDrive\Escritorio\Proyecto_AA3\02_Procesamiento_ETL\IVSM_Definitivo.csv"
SUPABASE_URL = "https://xysledaqzlelvppdkbvp.supabase.co"
# Pon aquí la SERVICE_ROLE key (no la anon key) para poder insertar sin autenticación de usuario
# O bien usa la anon key si la policy de insert está habilitada
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")

BATCH_SIZE = 500

if not SUPABASE_KEY:
    print("ERROR: Define la variable de entorno SUPABASE_SERVICE_KEY")
    print("  Windows CMD:  set SUPABASE_SERVICE_KEY=eyJ...")
    print("  PowerShell:   $env:SUPABASE_SERVICE_KEY='eyJ...'")
    sys.exit(1)

from supabase import create_client
client = create_client(SUPABASE_URL, SUPABASE_KEY)

# ── Leer CSV ───────────────────────────────────────────────────────────────────
rows = []
with open(CSV_PATH, encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for r in reader:
        rows.append({
            "codigo_ine":     r["CODIGO_INE"].strip().zfill(5),  # Asegurar 5 dígitos
            "nombre":         r["NOMBRE_MUNICIPIO"].strip(),
            "aire_pm":        float(r["AIRE_PM"]) if r["AIRE_PM"] else None,
            "ivsm_score":     float(r["IVSM_SCORE"]),
            "ivsm_categoria": r["IVSM_CATEGORIA"].strip(),
            "fuente_aire":    r["FUENTE_AIRE"].strip(),
        })

print(f"Filas leídas: {len(rows)}")

# ── Insertar en lotes ──────────────────────────────────────────────────────────
total = 0
for i in range(0, len(rows), BATCH_SIZE):
    batch = rows[i:i + BATCH_SIZE]
    res = client.table("municipios_ivsm").upsert(batch, on_conflict="codigo_ine").execute()
    total += len(batch)
    print(f"  [{total}/{len(rows)}] lotes insertados...")
    time.sleep(0.1)  # respetar rate limits

print(f"\nOK: {total} municipios cargados en Supabase.")
