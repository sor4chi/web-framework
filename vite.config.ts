/// <reference types="vitest" />
import { resolve } from "path";

import { defineConfig } from "vite";

export default defineConfig({
  test: {
    environment: "happy-dom",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
