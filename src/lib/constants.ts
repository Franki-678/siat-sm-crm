import type { TipoAlerta } from "@/types";

export const WEBHOOK_URL = process.env.NEXT_PUBLIC_WEBHOOK_URL ?? "http://192.168.0.92:5678/webhook/siat-sm";
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "SIAT-SM CRM";
export const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? "1.0.0";

export const NIVEL_ESTUDIOS_OPTIONS = [
  { value: "01", label: "Sin estudios" },
  { value: "02", label: "Estudios primarios incompletos" },
  { value: "03", label: "Educación primaria" },
  { value: "04", label: "Primera etapa de educación secundaria" },
  { value: "05", label: "Segunda etapa de educación secundaria" },
  { value: "06", label: "Formación profesional de grado superior" },
  { value: "07", label: "Diplomatura / Grado universitario" },
  { value: "08", label: "Licenciatura / Máster" },
  { value: "09", label: "Doctorado" },
];

export const ALCOHOL_OPTIONS = [
  { value: "01", label: "Nunca" },
  { value: "02", label: "Menos de 1 vez al mes" },
  { value: "03", label: "1-3 veces al mes" },
  { value: "04", label: "1 vez a la semana" },
  { value: "05", label: "2-4 veces a la semana" },
  { value: "06", label: "5-6 veces a la semana" },
  { value: "07", label: "1 vez al día" },
  { value: "08", label: "2-3 veces al día" },
  { value: "09", label: "4 o más veces al día" },
];

export const RISK_COLORS: Record<TipoAlerta, string> = {
  alerta_critica: "#EF4444",
  alerta_preventiva: "#F97316",
  alerta_informativa: "#EAB308",
  sin_alerta: "#22C55E",
};

export const RISK_LABELS: Record<TipoAlerta, string> = {
  alerta_critica: "Alerta Crítica",
  alerta_preventiva: "Alerta Preventiva",
  alerta_informativa: "Monitoreo Preventivo",
  sin_alerta: "Sin Riesgo Relevante",
};

export const RISK_RECOMMENDATIONS: Record<TipoAlerta, string> = {
  alerta_critica:
    "Su perfil de riesgo es crítico. Se recomienda consulta médica urgente y evitar actividades al aire libre en días de alta contaminación.",
  alerta_preventiva:
    "Su perfil presenta riesgo moderado-alto. Consulte con su médico para una evaluación preventiva.",
  alerta_informativa:
    "Su perfil está bajo seguimiento. Mantenga sus hábitos saludables y revise periódicamente.",
  sin_alerta:
    "Su perfil no presenta factores de riesgo relevantes. Continúe con sus hábitos actuales.",
};
