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
        target: "http://54.20.64.179:8080",
        changeOrigin: true,
        rewrite: (path) => path,
      },
      "/health": {
        target: "http://54.20.64.179:8080",
        changeOrigin: true,
      },
      "^/[A-Za-z]{3}-?[A-Za-z]{3}$": {
        target: "http://54.20.64.179:8080",
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
