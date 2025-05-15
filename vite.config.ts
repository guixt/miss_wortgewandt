import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  base: './', // Use relative path for GitHub Pages
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  plugins: [react(), tailwindcss(), tsconfigPaths()],
});
