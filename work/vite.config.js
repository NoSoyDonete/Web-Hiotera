import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  base: "./",
  server: { port: 5173 },
  preview: { port: 4173 },
  build: {
    rolldownOptions: {
      input: {
        main: fileURLToPath(new URL("./index.html", import.meta.url)),
        meteo: fileURLToPath(new URL("./meteo.html", import.meta.url)),
      },
    },
  },
});
