import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import glsl from "vite-plugin-glsl";

export default defineConfig({
  integrations: [preact()],
  outDir: "target",
  vite: {
    plugins: [glsl()],
    server: {
      watch: {
        ignored: ["**/.idea/**/*", "**/.husky/**/*"],
      },
    },
  },
});
