"use client";

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-[#0F1629] border border-white/10 shadow-2xl">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-white/10 border-t-blue-500 border-r-cyan-400 animate-spin" />
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-400/20" />
        </div>
        <div className="text-center">
          <p className="text-white font-semibold text-lg">Procesando en Raspberry Pi...</p>
          <p className="text-slate-400 text-sm mt-1">Servidor: 192.168.0.92</p>
        </div>
      </div>
    </div>
  );
}
