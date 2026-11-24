import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        basicScene: resolve(__dirname, "studies/basic-scene/index.html"),
        orbitControls: resolve(__dirname, "studies/orbit-controls/index.html"),
      },
    },
  },
});
