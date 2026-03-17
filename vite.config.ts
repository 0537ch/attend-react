import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          secure: true,
          timeout: 120000, // 2 minutes timeout for file uploads
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              // Log the request being proxied
              console.log(`[Proxy] ${req.method} ${req.url} -> ${options.target}${req.url}`);
            });
            proxy.on('error', (err, req, res) => {
              console.log('[Proxy Error]', err);
            });
          },
        },
      },
    },
  }
})

