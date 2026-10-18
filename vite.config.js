import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import summitContent from "./src/summit/content/vite-plugin.js";
import summitPreviews from "./src/summit/social-vite-plugin.js";

export default defineConfig({
  plugins: [summitContent(), react(), tailwindcss(), summitPreviews()],
});
