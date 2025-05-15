import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  base: '/miss_wortgewandt/', // Wichtig für GitHub Pages Routing
  build: {
    outDir: 'build/client',
    emptyOutDir: true,
  },
  plugins: [react(), tailwindcss(), tsconfigPaths()],
});
