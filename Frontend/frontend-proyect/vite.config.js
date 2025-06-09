import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // necesario para exponer por ngrok
    strictPort: true,
    port: 5173,
    allowedHosts: [
      "4647-2800-21e1-4000-637-59b2-4ad4-a4ca-a912.ngrok-free.app", // reemplazá por tu dominio real de ngrok
    ],
  },
});
