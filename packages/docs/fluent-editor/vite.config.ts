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
    'process.env': {
      npm_package_devDependencies_vite: process.env.npm_package_devDependencies_vite,
      npm_package_devDependencies_vitepress: process.env.npm_package_devDependencies_vitepress,
      npm_package_dependencies_vue: process.env.npm_package_dependencies_vue,
      npm_package_dependencies_quill: process.env.npm_package_dependencies_quill,
    },
  },
})
