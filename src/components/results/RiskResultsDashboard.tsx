"use client";

import { useState } from "react";
import { User, Wind, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import type { RiskResponse } from "@/types";
import {
  formatScore,
  getRiskColor,
  getRiskGradient,
  getRiskBorderColor,
  getRiskBgColor,
} from "@/lib/utils-medical";
import { RISK_RECOMMENDATIONS } from "@/lib/constants";
import { ScoreBar } from "@/components/ui/ScoreBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface RiskResultsDashboardProps {
  result: RiskResponse;
  onReset: () => void;
}

export function RiskResultsDashboard({ result, onReset }: RiskResultsDashboardProps) {
  const [desglosOpen, setDesglosOpen] = useState(false);

  const totalDesglose =
    result.desglose.termino_endogeno +
    result.desglose.termino_ambiental +
    result.desglose.termino_sinergico;

  const desglosePct = (v: number) =>
    totalDesglose > 0 ? ((v / totalDesglose) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-4 animate-slide-up">
      {/* CARD PRINCIPAL */}
      <div
        className={cn(
          "rounded-2xl border p-6 bg-gradient-to-br",
          getRiskGradient(result.tipo_alerta),
          getRiskBorderColor(result.tipo_alerta)
        )}
      >
        <div className="text-center space-y-2">
          <div
            className={cn(
              "text-5xl",
              result.tipo_alerta === "alerta_critica" && "risk-pulse inline-block"
            )}
          >
            {result.emoji}
          </div>
          <div className={cn("text-7xl font-black tracking-tight", getRiskColor(result.tipo_alerta))}>
            {formatScore(result.riesgo_total)}
          </div>
          <StatusBadge
            tipo_alerta={result.tipo_alerta}
            emoji={result.emoji}
            pulse={result.tipo_alerta === "alerta_critica"}
            className="text-base px-4 py-1.5"
          />
          <p className="text-sm text-slate-400">
            {result.municipio} ·{" "}
            <span className="text-slate-300">{result.ivsm_categoria}</span>
          </p>
        </div>

        <div className="mt-5">
          <div className="flex justify-between text-xs text-slate-400 mb-1.5">
            <span>Sin riesgo</span>
            <span>Riesgo total: {formatScore(result.riesgo_total)}</span>
            <span>Crítico</span>
          </div>
          <ScoreBar value={result.riesgo_total} height="h-4" />
        </div>
      </div>

      {/* CARDS DE MÉTRICAS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Riesgo individual */}
        <Tooltip>
          <TooltipTrigger className="text-left block w-full cursor-help">
            <div className="rounded-2xl border border-white/8 bg-card p-4 hover:border-blue-500/30 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-blue-500/15 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <span className="text-xs text-slate-400 font-medium">Riesgo Individual</span>
              </div>
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {formatScore(result.p_base)}
              </div>
              <ScoreBar value={result.p_base} height="h-2" />
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs bg-[#0F1629] border-white/10 text-slate-300">
            Probabilidad calculada por el modelo Random Forest basada en el perfil clínico del paciente.
          </TooltipContent>
        </Tooltip>

        {/* Índice ambiental */}
        <div className="rounded-2xl border border-white/8 bg-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/15 flex items-center justify-center">
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <span className="text-xs text-slate-400 font-medium">Índice Ambiental IVSM</span>
          </div>
          <div className="text-3xl font-bold text-cyan-400 mb-1">
            {formatScore(result.ivsm_score)}
          </div>
          <p className="text-[11px] text-slate-500 mb-2">
            {result.ivsm_categoria} · {result.fuente_aire}
          </p>
          <ScoreBar value={result.ivsm_score} height="h-2" />
        </div>

        {/* Factor sinérgico */}
        <div className="rounded-2xl border border-white/8 bg-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-purple-500/15 flex items-center justify-center">
              <span className="text-purple-400 text-xs font-bold">RT</span>
            </div>
            <span className="text-xs text-slate-400 font-medium">Desglose Sinérgico</span>
          </div>
          <p className="text-[10px] text-slate-500 mb-2 font-mono">
            RT = 0.55·P + 0.20·IVSM + 0.25·(P×IVSM)
          </p>
          <div className="space-y-1.5">
            {[
              { label: "Endógeno", value: result.desglose.termino_endogeno, color: "bg-blue-500" },
              { label: "Ambiental", value: result.desglose.termino_ambiental, color: "bg-cyan-500" },
              { label: "Sinérgico", value: result.desglose.termino_sinergico, color: "bg-purple-500" },
            ].map((t) => (
              <div key={t.label} className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 w-16 shrink-0">{t.label}</span>
                <div className="flex-1 h-2 bg-white/8 rounded-full overflow-hidden">
                  <div
                    className={`h-2 rounded-full ${t.color}`}
                    style={{
                      width: `${totalDesglose > 0 ? (t.value / totalDesglose) * 100 : 0}%`,
                    }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 w-10 text-right shrink-0">
                  {t.value.toFixed(3)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DESGLOSE TÉCNICO (collapsible) */}
      <div className="rounded-2xl border border-white/8 bg-card overflow-hidden">
        <button
          onClick={() => setDesglosOpen(!desglosOpen)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-white/3 transition-colors"
        >
          <span className="font-medium text-slate-300 text-sm">Desglose Técnico</span>
          {desglosOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {desglosOpen && (
          <div className="px-4 pb-4 animate-fade-in">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="text-left py-2 text-xs text-slate-500 font-medium">Término</th>
                  <th className="text-left py-2 text-xs text-slate-500 font-medium">Fórmula</th>
                  <th className="text-right py-2 text-xs text-slate-500 font-medium">Valor</th>
                  <th className="py-2 w-20 text-xs text-slate-500 font-medium">%</th>
                  <th className="py-2 w-24 text-xs text-slate-500 font-medium">Proporción</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    name: "Término endógeno",
                    formula: "0.55 · P",
                    value: result.desglose.termino_endogeno,
                  },
                  {
                    name: "Término ambiental",
                    formula: "0.20 · IVSM",
                    value: result.desglose.termino_ambiental,
                  },
                  {
                    name: "Término sinérgico",
                    formula: "0.25 · P×IVSM",
                    value: result.desglose.termino_sinergico,
                  },
                ].map((row) => (
                  <tr key={row.name} className="border-b border-white/5">
                    <td className="py-2.5 text-slate-300 text-xs">{row.name}</td>
                    <td className="py-2.5 font-mono text-slate-500 text-xs">{row.formula}</td>
                    <td className="py-2.5 text-right text-slate-300 text-xs font-medium">
                      {row.value.toFixed(4)}
                    </td>
                    <td className="py-2.5 text-center text-slate-400 text-xs">
                      {desglosePct(row.value)}%
                    </td>
                    <td className="py-2.5 pl-2">
                      <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                        <div
                          className="h-1.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                          style={{
                            width: `${totalDesglose > 0 ? (row.value / totalDesglose) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* RECOMENDACIÓN */}
      <div
        className={cn(
          "rounded-2xl border p-4",
          getRiskBgColor(result.tipo_alerta),
          getRiskBorderColor(result.tipo_alerta)
        )}
      >
        <h4 className="font-semibold text-foreground mb-2 text-sm">Recomendación</h4>
        <p className="text-slate-300 text-sm leading-relaxed">
          {RISK_RECOMMENDATIONS[result.tipo_alerta]}
        </p>

        <button
          onClick={onReset}
          className="mt-4 flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          Nueva Evaluación
        </button>
      </div>
    </div>
  );
}
