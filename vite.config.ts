import { resolve } from "path";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  plugins: [solidPlugin()],
  build: {
    target: "esnext",
  },
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      "~": resolve(__dirname, "src"),
    },
  },
});
