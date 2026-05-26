import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sin "output: standalone" — Vercel gestiona el deployment directamente.
  // standalone es solo para Docker/self-hosting.
};

export default nextConfig;
