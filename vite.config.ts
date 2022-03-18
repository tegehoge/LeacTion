import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig(({ mode }) => {
  const isProduction = mode == "production";

  return {
    plugins: [vue()],
    build: {
      sourcemap: !isProduction,
    },
  };
});
