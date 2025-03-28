import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({}) => {

  return {
    base: './',
    plugins: [react({
      jsxRuntime: 'automatic'
    })],
    build: {
      outDir: 'dist_button',
      rollupOptions: {
        input: path.resolve(__dirname, 'index.html'),
        external: ['@hulk/common'],
        output: {
          globals: {
            '@hulk/common': '@hulk/common'
          }
        }
      },
    },
    resolve: {
      alias: {
        '@hulk/common': path.resolve(__dirname, '../common'),
      }
    }
  }
})