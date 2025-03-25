import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../../')
    }
  },
  build: {
    outDir: 'dist_' + '{{nameKebab}}',
    rollupOptions: {
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
  resolve: {
    alias: {
      '@hulk/common': path.resolve(__dirname, 'packages/common/main'),
      '@packages': './packages',
      '@': '.',
    }
  }
})
