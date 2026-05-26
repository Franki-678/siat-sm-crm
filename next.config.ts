import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  env: {
    NEXT_PUBLIC_WEBHOOK_URL: process.env.NEXT_PUBLIC_WEBHOOK_URL ?? "",
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME ?? "SIAT-SM CRM",
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION ?? "1.0.0",
  },
};

export default nextConfig;
