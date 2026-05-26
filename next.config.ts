import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sin "output: standalone" — Vercel gestiona el deployment directamente.
  // standalone es solo para Docker/self-hosting.

  // Incluir model/rf_compact.json en el bundle de la función serverless /api/rf-predict
  experimental: {
    outputFileTracingIncludes: {
      "/api/rf-predict": ["./model/**"],
    },
  },
};

export default nextConfig;
