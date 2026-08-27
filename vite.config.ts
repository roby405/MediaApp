import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
// import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  plugins: [
    babel({
      plugins: ["babel-plugin-react-compiler"],
    }),
    react(),
    tailwindcss(),
    // basicSsl(),
  ],
  server: { host: true },
});