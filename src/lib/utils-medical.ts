import type { TipoAlerta } from "@/types";

export const MUNICIPIOS_FRECUENTES = [
  { codigo: "28079", nombre: "Madrid" },
  { codigo: "08019", nombre: "Barcelona" },
  { codigo: "46250", nombre: "Valencia" },
  { codigo: "41091", nombre: "Sevilla" },
  { codigo: "50297", nombre: "Zaragoza" },
  { codigo: "29067", nombre: "Málaga" },
  { codigo: "30030", nombre: "Murcia" },
  { codigo: "07040", nombre: "Palma" },
  { codigo: "35016", nombre: "Las Palmas de Gran Canaria" },
  { codigo: "48020", nombre: "Bilbao" },
  { codigo: "03065", nombre: "Alicante" },
  { codigo: "47186", nombre: "Valladolid" },
  { codigo: "15030", nombre: "A Coruña" },
  { codigo: "20069", nombre: "San Sebastián" },
  { codigo: "30016", nombre: "Cartagena" },
  { codigo: "18087", nombre: "Granada" },
  { codigo: "14021", nombre: "Córdoba" },
  { codigo: "47186", nombre: "Valladolid" },
  { codigo: "28005", nombre: "Alcalá de Henares" },
  { codigo: "28045", nombre: "Getafe" },
  { codigo: "46113", nombre: "Gandía" },
  { codigo: "08101", nombre: "L'Hospitalet de Llobregat" },
];

export function getRiskColor(tipo_alerta: TipoAlerta): string {
  switch (tipo_alerta) {
    case "alerta_critica":
      return "text-red-500";
    case "alerta_preventiva":
      return "text-orange-500";
    case "alerta_informativa":
      return "text-yellow-500";
    case "sin_alerta":
      return "text-green-500";
    default:
      return "text-gray-500";
  }
}

export function getRiskBorderColor(tipo_alerta: TipoAlerta): string {
  switch (tipo_alerta) {
    case "alerta_critica":
      return "border-red-500/50";
    case "alerta_preventiva":
      return "border-orange-500/50";
    case "alerta_informativa":
      return "border-yellow-500/50";
    case "sin_alerta":
      return "border-green-500/50";
    default:
      return "border-gray-500/50";
  }
}

export function getRiskBgColor(tipo_alerta: TipoAlerta): string {
  switch (tipo_alerta) {
    case "alerta_critica":
      return "bg-red-500/10";
    case "alerta_preventiva":
      return "bg-orange-500/10";
    case "alerta_informativa":
      return "bg-yellow-500/10";
    case "sin_alerta":
      return "bg-green-500/10";
    default:
      return "bg-gray-500/10";
  }
}

export function getRiskGradient(tipo_alerta: TipoAlerta): string {
  switch (tipo_alerta) {
    case "alerta_critica":
      return "from-red-950/30 to-red-900/10";
    case "alerta_preventiva":
      return "from-orange-950/30 to-orange-900/10";
    case "alerta_informativa":
      return "from-yellow-950/30 to-yellow-900/10";
    case "sin_alerta":
      return "from-green-950/30 to-green-900/10";
    default:
      return "from-gray-950/30 to-gray-900/10";
  }
}

export function formatScore(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

export function getMunicipioLabel(codigo: string): string {
  const found = MUNICIPIOS_FRECUENTES.find((m) => m.codigo === codigo);
  return found ? found.nombre : `Municipio ${codigo}`;
}
