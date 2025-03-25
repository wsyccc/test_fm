{
  "name": "{{nameKebab}}",
  "version": "0.0.0",
  "main": "dist/{{nameKebab}}.umd.js",
  "module": "dist/{{nameKebab}}.es.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "vite build",
    "dev": "vite"
  },
  "peerDependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "dependencies": {
    "@hulk/common": "*"
  }
}
