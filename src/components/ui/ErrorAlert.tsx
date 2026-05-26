"use client";

import { AlertTriangle, WifiOff, Clock, Server } from "lucide-react";

interface ErrorAlertProps {
  error: Error;
  onRetry?: () => void;
}

export function ErrorAlert({ error, onRetry }: ErrorAlertProps) {
  const isNetwork = error.name === "NetworkError";
  const isTimeout = error.name === "TimeoutError";
  const isServer = error.name === "ServerError";

  const config = isNetwork
    ? {
        icon: <WifiOff className="w-5 h-5 text-red-400" />,
        title: "Sin conexión con el servidor",
        message:
          "La Raspberry Pi en 192.168.0.92 no está accesible. Verifica que el dispositivo esté encendido y conectado a la red.",
        color: "border-red-500/30 bg-red-500/10",
        titleColor: "text-red-400",
      }
    : isTimeout
    ? {
        icon: <Clock className="w-5 h-5 text-orange-400" />,
        title: "Tiempo de espera agotado",
        message:
          "El servidor tardó más de 15 segundos en responder. Verifica que n8n esté corriendo en la Raspberry Pi.",
        color: "border-orange-500/30 bg-orange-500/10",
        titleColor: "text-orange-400",
      }
    : {
        icon: <Server className="w-5 h-5 text-yellow-400" />,
        title: "Error en el motor de decisión",
        message: error.message,
        color: "border-yellow-500/30 bg-yellow-500/10",
        titleColor: "text-yellow-400",
      };

  return (
    <div className={`rounded-xl border p-4 ${config.color} animate-fade-in`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{config.icon}</div>
        <div className="flex-1">
          <h4 className={`font-semibold ${config.titleColor} mb-1`}>{config.title}</h4>
          <p className="text-sm text-slate-400">{config.message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 text-sm font-medium text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
            >
              Reintentar
            </button>
          )}
        </div>
        <AlertTriangle className="w-4 h-4 text-slate-500 shrink-0" />
      </div>
    </div>
  );
}
