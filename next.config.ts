import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker uchun: .next/standalone ichida node_modules'siz ishga tushadigan minimal server
  output: "standalone",
  // Loyiha ildizi shu papka (yuqoridagi boshqa package-lock.json fayllari hisobga olinmasin)
  turbopack: { root: path.join(__dirname) },
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
