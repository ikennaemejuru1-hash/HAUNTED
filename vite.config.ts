/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Vite builds and serves the app. The plugins teach it React and Tailwind.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    // jsdom pretends to be a browser so components can be tested without one.
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test-setup.ts',
  },
})
