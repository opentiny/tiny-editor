import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const fluentEditorRoot = path.resolve(__dirname, '../fluent-editor')
export default defineConfig({
  base: '/tiny-editor/projects/',
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: '@opentiny/fluent-editor/style.scss',
        replacement: path.resolve(fluentEditorRoot, 'src/assets/style.scss'),
      },
    ],
  },
  build: {
    outDir: '../docs/fluent-editor/.vitepress/dist/projects'
  }
})
