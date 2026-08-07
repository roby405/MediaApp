import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    babel({
      plugins: ["babel-plugin-react-compiler"],
    }),
    react(),
    tailwindcss(),
  ],
});