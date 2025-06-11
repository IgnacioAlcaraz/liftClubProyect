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
      "5353-2800-21e1-4000-8c7-e996-11c8-4c31-73df.ngrok-free.app", // reemplazá por tu dominio real de ngrok
    ],
  },
});
