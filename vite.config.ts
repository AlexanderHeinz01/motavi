/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  test: {
    // contrastReport.ts reads tokens.css via ?raw; vitest empties CSS by default
    css: { include: [/tokens\.css/] },
  },
})
