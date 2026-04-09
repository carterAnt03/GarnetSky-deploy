import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

const testsNodeModules = path.resolve(import.meta.dirname, "node_modules");

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      react: path.join(testsNodeModules, "react"),
      "react-dom": path.join(testsNodeModules, "react-dom"),
      "react-router-dom": path.join(testsNodeModules, "react-router-dom"),
    },
    dedupe: ["react", "react-dom", "react-router-dom"],
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./ui/setup.js"],
    include: ["ui/**/*.test.{js,jsx}"],
    exclude: ["**/node_modules/**", "**/dist/**", "**/build/**"],
  },
});
