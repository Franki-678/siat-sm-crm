import { z } from "zod";

export const riskFormSchema = z.object({
  SEXOa: z.number().int().min(1).max(2, "Selecciona el sexo"),
  EDADa: z.number().int().min(15, "Edad mínima 15 años").max(69, "Edad máxima 69 años"),
  NIVEST: z.string().regex(/^0[1-9]$/, "Selecciona el nivel de estudios"),
  T112: z.number().int().min(1).max(4, "Selecciona el nivel de tabaquismo"),
  T113: z.number().int().min(0).max(7, "Valor entre 0 y 7 horas"),
  V121: z.number().int().min(1).max(4, "Selecciona el nivel de actividad"),
  W127: z.string().regex(/^0[1-9]$/, "Selecciona la frecuencia de consumo"),
  IMCa: z.number().int().min(1).max(4, "Selecciona la categoría IMC"),
  CODIGO_INE: z
    .string()
    .length(5, "El código INE debe tener exactamente 5 dígitos")
    .regex(/^\d{5}$/, "El código INE debe contener solo dígitos"),
});

export type RiskFormValues = z.infer<typeof riskFormSchema>;
