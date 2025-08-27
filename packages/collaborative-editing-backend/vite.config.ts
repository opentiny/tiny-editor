import path from 'node:path'
import { globSync } from 'glob'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    ssr: true,
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2022',
    sourcemap: true,
    rollupOptions: {
      // 遍历 src 下所有 ts 文件作为入口
      input: Object.fromEntries(
        globSync('src/**/*.ts', { ignore: ['**/*.d.ts'] }).map(file => [
          path.relative('src', file).replace(/\.ts$/, ''),
          path.resolve(file),
        ]),
      ),
      output: {
        format: 'esm',
        preserveModules: true, // 保留模块和目录
        preserveModulesRoot: 'src', // 以 src 为根
        entryFileNames: '[name].js', // 扩展名改为 .js
        chunkFileNames: '[name].js',
        assetFileNames: '[name][extname]',
      },
    },
  },
})
