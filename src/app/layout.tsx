import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SIAT-SM — Sistema de Análisis de Riesgo Cardiorrespiratorio",
  description:
    "Sistema Integrado de Alerta Temprana. Modelo Random Forest con datos ambientales IVSM. Red local, privacidad garantizada.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
