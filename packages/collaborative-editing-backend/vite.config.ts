import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    ssr: true,
    target: 'node18',
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, 'src/server.ts'),
      name: 'CollaborativeEditingBackend',
      fileName: 'server',
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'node:http',
        'node:fs',
        'node:path',
        'node:url',
        'ws',
        'mongodb',
        'yjs',
        'y-mongodb-provider',
        'lib0',
        '@y/protocols',
      ],
      output: {
        format: 'es',
        entryFileNames: 'server.js',
      },
    },
    minify: false,
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  esbuild: {
    target: 'node18',
    platform: 'node',
  },
})
