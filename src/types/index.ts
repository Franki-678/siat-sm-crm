export interface FormPayload {
  SEXOa: number;
  EDADa: number;
  NIVEST: string;
  T112: number;
  T113: number;
  V121: number;
  W127: string;
  IMCa: number;
  CODIGO_INE: string;
}

export interface RiskDesglose {
  termino_endogeno: number;
  termino_ambiental: number;
  termino_sinergico: number;
}

export type TipoAlerta =
  | "alerta_critica"
  | "alerta_preventiva"
  | "alerta_informativa"
  | "sin_alerta";

export type CategoriaRiesgo =
  | "Alerta Crítica"
  | "Alerta Preventiva"
  | "Monitoreo Preventivo"
  | "Sin Riesgo Relevante";

export interface RiskResponse {
  p_base: number;
  ivsm_score: number;
  riesgo_total: number;
  municipio: string;
  ivsm_categoria: string;
  fuente_aire: string;
  categoria: CategoriaRiesgo;
  emoji: string;
  tipo_alerta: TipoAlerta;
  desglose: RiskDesglose;
}

export interface FormFields {
  SEXOa: number;
  EDADa: number;
  NIVEST: string;
  T112: number;
  T113: number;
  V121: number;
  W127: string;
  IMCa: number;
  CODIGO_INE: string;
  peso?: number;
  altura?: number;
}
