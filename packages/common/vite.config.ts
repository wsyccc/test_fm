import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import dts from 'vite-plugin-dts';
import path from "path";

export default defineConfig({
  plugins: [react(), dts({
    insertTypesEntry: true,
    rollupTypes: true,
  })],
  resolve: {
    alias: {
      '@hulk/common': path.resolve(__dirname, '../common/dist_common/common.es.js')
    }
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, './index.ts'),
      name: 'HulkCommon',
      formats: ['umd', 'es'],
      fileName: (format) => `common.${format}.js`
    },
    outDir: 'dist_common',
    rollupOptions: {
      external: []
      // external: ['react', 'react-dom', 'antd', '@vitejs/plugin-react', 'antd-style', 'lodash', 'dayjs', 'classnames'],
      // output: {
      //   globals: {
      //     react: 'React',
      //     'react-dom': 'ReactDOM',
      //     antd: 'antd',
      //     'antd-style': 'antd-style',
      //     '@vitejs/plugin-react': 'vite-plugin-react',
      //     lodash: '_',
      //     dayjs: 'dayjs',
      //     classnames: 'classnames',
      //   }
      // }
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  }
});