"use client";

import Link from "next/link";
import { Settings, ArrowLeft } from "lucide-react";

export default function ConfiguracionPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-500/10 flex items-center justify-center mb-4">
        <Settings className="w-8 h-8 text-slate-400/60" />
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-2">Configuración</h2>
      <p className="text-slate-400 text-sm mb-6">Módulo en desarrollo · Disponible en AA3</p>
      <Link
        href="/"
        className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a Evaluación
      </Link>
    </div>
  );
}
