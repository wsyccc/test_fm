import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({}) => {

  return {
    plugins: [react()],
    build: {
      outDir: 'dist_{{nameKebab}}',
      rollupOptions: {
        input: path.resolve(__dirname, 'index.html'),
        external: ['react', 'react-dom', '@hulk/common', "@vitejs/plugin-react"],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            '@hulk/common': '@hulk/common',
            '@vitejs/plugin-react': '@vitejs/plugin-react'
          }
        }
      },
    },
  }
})