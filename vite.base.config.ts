// packages/Button/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from "path";

export function baseViteConfig(libName: string) {
  return defineConfig({
    plugins: [react()],
    build: {
      lib: {
        entry: 'src/index.tsx',
        name: libName,
        fileName: (format) => `${libName}.${format}.js`
      },
      outDir: `dist_${libName}`,
      rollupOptions: {
        external: ['@hulk/common', 'react', "react-dom", "@vitejs/plugin-react"],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            '@hulk/common': '@hulk/common',
            '@vitejs/plugin-react': '@vitejs/plugin-react'
          }
        }
      }
    },
    resolve: {
      alias: {
        '@hulk/common': path.resolve(__dirname, 'packages/common/main'),
        '@packages': './packages',
        '@': '.',
      }
    }
  });
}
