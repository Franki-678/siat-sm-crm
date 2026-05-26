import { createClient } from "@supabase/supabase-js";

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? "https://xysledaqzlelvppdkbvp.supabase.co";
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Sin genérico Database hasta aplicar la migración y regenerar tipos
// (ejecutar: npx supabase gen types typescript --project-id xysledaqzlelvppdkbvp)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase = createClient<any>(supabaseUrl, supabaseAnon);

// Helper tipado para el insert de consultas
export interface ConsultaInsert {
  sesion_id:        string;
  sexo:             number;
  edad:             number;
  nivel_estudios:   number;
  tabaquismo:       number;
  cigarrillos_dia:  number;
  actividad_fisica: number;
  alcohol:          number;
  imc_categoria:    number;
  codigo_ine:       string;
  p_base:           number;
  ivsm_score?:      number | null;
  riesgo_total:     number;
  categoria:        string;
  tipo_alerta:      string;
  municipio?:       string | null;
  duracion_ms?:     number | null;
}

export async function guardarConsulta(data: ConsultaInsert) {
  const { error } = await supabase.from("consultas").insert(data);
  if (error) {
    // No bloquear al usuario si falla el guardado — solo loguear
    console.error("[SIAT-SM] Error guardando consulta en Supabase:", error.message);
  }
}
