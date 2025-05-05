import {defineConfig, loadEnv} from "vite";
import react from "@vitejs/plugin-react";
import dts from 'vite-plugin-dts';
import version from 'vite-plugin-package-version';
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), dts({
      entryRoot: 'src',
      outDir: 'dist_common',
      include: ['index.ts'],
    }), version()],
    build: {
      lib: {
        entry: {
          'index': path.resolve(__dirname, './index.ts')
        },
        name: 'HulkCommon',
        formats: ['es'],
        fileName: (format, entryName) => `common.${entryName}.${format}.js`
      },
      outDir: 'dist_common',
      emptyOutDir: true,
      rollupOptions: {
        external: []
      }
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env.APP_ENV': JSON.stringify(env.APP_ENV || mode)
    }
  }
});