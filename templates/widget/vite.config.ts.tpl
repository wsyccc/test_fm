import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({}) => {

  return {
    base: './',
    plugins: [react()],
    build: {
      outDir: 'dist_{{nameKebab}}',
      rollupOptions: {
        input: path.resolve(__dirname, 'index.html'),
        external: ['react', 'react-dom', '@hulk/common', "@vitejs/plugin-react"]
        output: {
          paths: {
            '@hulk/common': '/dist_common/common.umd.js',
          }
        }
      },
    },
  }
})