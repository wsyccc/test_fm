import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({}) => {

  return {
    base: 'dist_button',
    plugins: [react()],
    build: {
      outDir: 'dist_button',
      rollupOptions: {
        input: path.resolve(__dirname, 'index.html'),
        external: ['react', 'react-dom', '@hulk/common', "@vitejs/plugin-react"]
      },
    },
  }
})