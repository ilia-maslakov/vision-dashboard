import { defineConfig } from 'vitest/config'
import path from 'path'
import react from '@vitejs/plugin-react'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [react(),],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    coverage: {
      reporter: ['text', 'json', 'html'],
      provider: 'istanbul',
      exclude: [
        'next.config.js',
        'postcss.config.js',
        'tailwind.config.js',
        'vite.config.ts',
        '.next/**',
      ],
    },
  },
})
