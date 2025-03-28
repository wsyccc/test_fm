import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [react(), dts({
    insertTypesEntry: true,
    rollupTypes: true,
  })],
  build: {
    lib: {
      entry: 'index.ts',
      name: '@hulk/common',
      formats: ['umd', 'es'],
      fileName: (format) => `common.${format}.js`
    },
    outDir: 'dist_common',
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  },
});