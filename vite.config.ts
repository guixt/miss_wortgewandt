import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  base: '/', // Correct base path for routing
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  build: {
    outDir: 'build/client', // Consistent build output path
    emptyOutDir: true,
  },
});
