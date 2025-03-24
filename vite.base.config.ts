// packages/Button/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export function baseViteConfig(libName: string) {
  return defineConfig({
    plugins: [react()],
    build: {
      lib: {
        entry: 'src/index.tsx',
        name: libName
      },
      rollupOptions: {
        external: ['@hulk/common'],
        output: {
          globals: {
            react: 'React'
          }
        }
      }
    }
  });
}
