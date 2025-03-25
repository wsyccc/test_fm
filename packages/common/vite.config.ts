import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import path from "path"
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [react(), dts({
    insertTypesEntry: true,
    rollupTypes: true,
  })],
  build: {
    lib: {
      entry: 'main.ts',
      name: '@hulk/common',
      formats: ['es', 'umd'],
      fileName: (format) => `common.${format}.js`
    },
    outDir: 'dist_common',
    rollupOptions: {
      external: ['@hulk/common', 'react', "react-dom", '@vitejs/plugin-react'],
      output: {
        globals: {
          'react': 'React',
          'react-dom': 'ReactDOM',
          '@vitejs/plugin-react': '@vitejs/plugin-react'
        }
      }
    }
  },
  resolve: {
    alias: {
      '@packages': path.resolve(__dirname, '/packages'),
      '@': '.',
    }
  },
});