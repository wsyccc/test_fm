import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({}) => {

  return {
    base: 'dist_other_charts',
    plugins: [react()],
    resolve: {
      alias: {
        '@hulk/common': path.resolve(__dirname, '../../dist/dist_common/common.es.js'),
      }
    },
    build: {
      outDir: 'dist_other_charts',
      rollupOptions: {
        input: path.resolve(__dirname, 'index.html'),
        external: ['@hulk/common']
      },
    },
  }
})