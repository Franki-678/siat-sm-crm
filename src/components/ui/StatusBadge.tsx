"use client";

import type { TipoAlerta } from "@/types";
import { RISK_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  tipo_alerta: TipoAlerta;
  emoji?: string;
  className?: string;
  pulse?: boolean;
}

const colorMap: Record<TipoAlerta, string> = {
  alerta_critica: "bg-red-500/20 text-red-400 border border-red-500/40",
  alerta_preventiva: "bg-orange-500/20 text-orange-400 border border-orange-500/40",
  alerta_informativa: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40",
  sin_alerta: "bg-green-500/20 text-green-400 border border-green-500/40",
};

export function StatusBadge({ tipo_alerta, emoji, className, pulse }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium",
        colorMap[tipo_alerta],
        pulse && tipo_alerta === "alerta_critica" && "risk-pulse",
        className
      )}
    >
      {emoji && <span>{emoji}</span>}
      {RISK_LABELS[tipo_alerta]}
    </span>
  );
}
