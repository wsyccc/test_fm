import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({}) => {

  return {
    base: 'dist_three_d',
    plugins: [react()],
    resolve: {
      alias: {
        '@hulk/common': path.resolve(__dirname, '../../dist/dist_common/common.index.es.js'),
        '@packages': path.resolve(__dirname, '../../packages'),
      }
    },
    build: {
      outDir: 'dist_three_d',
      rollupOptions: {
        input: path.resolve(__dirname, 'index.html'),
        external: ['@hulk/common'],
        output: {
          entryFileNames: 'assets/index.js',
          chunkFileNames: 'assets/[name].js',
          manualChunks(id) {
            if (id.endsWith('/src/index.tsx'))  return 'component'
            if (id.endsWith('/src/context.ts')) return 'context'
            return undefined
          }
        }
      },
    },
  }
})