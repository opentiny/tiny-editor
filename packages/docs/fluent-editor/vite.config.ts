import path from 'node:path'
import { viteDemoPreviewPlugin } from '@vitepress-code-preview/plugin'
import { defineConfig } from 'vite'

const fluentEditorRoot = path.resolve(__dirname, '../../fluent-editor')
export default defineConfig({
  plugins: [viteDemoPreviewPlugin()],
  resolve: {
    alias: [
      {
        find: '@opentiny/fluent-editor/package.json',
        replacement: path.resolve(fluentEditorRoot, 'package.json'),
      },
      {
        find: '@opentiny/fluent-editor/style.scss',
        replacement: path.resolve(fluentEditorRoot, 'src/assets/style.scss'),
      },
    ],
  },
  define: {
    'process.env': { ...process.env },
  },
})
