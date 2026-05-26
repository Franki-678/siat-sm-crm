export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      consultas: {
        Row: {
          id: string;
          created_at: string;
          // Identificación (no PII real — DNI nunca persiste en producción)
          sesion_id: string;
          // Variables clínicas
          sexo: number;
          edad: number;
          nivel_estudios: number;
          tabaquismo: number;
          cigarrillos_dia: number;
          actividad_fisica: number;
          alcohol: number;
          imc_categoria: number;
          codigo_ine: string;
          // Resultado del motor
          p_base: number;
          ivsm_score: number | null;
          riesgo_total: number;
          categoria: string;
          tipo_alerta: string;
          municipio: string | null;
          // Meta
          duracion_ms: number | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          sesion_id: string;
          sexo: number;
          edad: number;
          nivel_estudios: number;
          tabaquismo: number;
          cigarrillos_dia: number;
          actividad_fisica: number;
          alcohol: number;
          imc_categoria: number;
          codigo_ine: string;
          p_base: number;
          ivsm_score?: number | null;
          riesgo_total: number;
          categoria: string;
          tipo_alerta: string;
          municipio?: string | null;
          duracion_ms?: number | null;
        };
        Update: Partial<Database["public"]["Tables"]["consultas"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
