import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import dts from 'vite-plugin-dts';
import path from "path";
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [react(), dts(), viteStaticCopy({
    targets: [
      {
        src: 'public/*',
        dest: 'public'
      }
    ]
  })],
  build: {
    lib: {
      entry: {
        'index': path.resolve(__dirname, './index.ts')
      },
      name: 'HulkCommon',
      formats: ['umd', 'es'],
      fileName: (format) => `common.${format}.js`
    },
    outDir: 'dist_common',
    rollupOptions: {
      external: []
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  }
});