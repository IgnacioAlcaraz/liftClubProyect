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
      "6aca-2800-21e1-4000-2b4-39ec-1b05-c9-cda2.ngrok-free.app",
    ],
  },
});
