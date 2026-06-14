import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  return {
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: env.VITE_API_URL ?? "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path,
      },
      "^/[A-Za-z]{3}-?[A-Za-z]{3}$": {
        target: env.VITE_API_URL ?? "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  }
})
