import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    strictPort: true,
    port: 5173,
    allowedHosts: [
      "912c-2800-21e1-4000-2b4-d991-b749-d096-8db6.ngrok-free.app",
    ],
  },
});
