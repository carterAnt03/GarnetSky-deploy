import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

// Force ALL source files (including ../app/src/*) to use the SAME React instance:
// the one installed in /tests/node_modules.
const testsNodeModules = path.resolve(__dirname, "node_modules");

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      react: path.join(testsNodeModules, "react"),
      "react-dom": path.join(testsNodeModules, "react-dom"),
      "react-router": path.join(testsNodeModules, "react-router"),
      "react-router-dom": path.join(testsNodeModules, "react-router-dom"),
    },
    dedupe: ["react", "react-dom", "react-router", "react-router-dom"],
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./ui/setup.js",
  },
});
