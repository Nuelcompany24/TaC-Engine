import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Vercel-specific optimizations
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  define: {
    'process.env': {}
  },
  // Optional: Add proxy to fix CORS during local development
  server: {
    proxy: {
      "/gemini-api": {
        target: "https://generativelanguage.googleapis.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/gemini-api/, ""),
      },
    },
  },
});
