import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { createGenerator, Config } from "ts-json-schema-generator";
import {exportSchemaFilter} from "../../utils";

export default defineConfig(({}) => {

  return {
    base: './',
    plugins: [react(), {
      name: 'widget-props-schema',
      apply: 'build',
      enforce: 'pre',
      buildStart() {
        const tsconfigPath = path.resolve(__dirname, 'tsconfig.json');
        const inputFile = path.resolve(__dirname, 'src/type.ts');
        const typeName = '{{namePascal}}PropsInterface';

        const config: Config = {
          path: inputFile,
          tsconfig: tsconfigPath,
          type: typeName,
          skipTypeCheck: true,
          topRef: false,
          minify: true,
          encodeRefs: false,
          jsDoc: "none"
        };
        const schema = createGenerator(config).createSchema(typeName);

        this.emitFile({
          type: 'asset',
          fileName: 'configs.schema.json',
          source: JSON.stringify(exportSchemaFilter(schema), null, 2)
        })
      }
    }],
    resolve: {
      alias: {
        '@hulk/common': path.resolve(__dirname, '../../dist/dist_common/common.es.js'),
        '@packages': path.resolve(__dirname, '../../packages'),
      }
    },
    build: {
      outDir: 'dist_{{nameKebab}}',
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