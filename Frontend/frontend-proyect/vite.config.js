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
      "793e-2800-21e1-4000-2b4-d180-3893-b282-fa47.ngrok-free.app",
    ],
  },
});
