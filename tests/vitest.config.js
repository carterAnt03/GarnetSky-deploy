/**
 * Vitest Configuration for UI Tests
 */

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./ui/setup.js'],
    include: ['./ui/**/*.test.{js,jsx}'],
    globals: true,
  },
});
