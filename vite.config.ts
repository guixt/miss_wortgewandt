import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  base: './', // Korrekter Pfad für GitHub Pages
  build: {
    outDir: 'build/client',
    emptyOutDir: true,
  },
  plugins: [react(), tailwindcss(), tsconfigPaths()],
});
