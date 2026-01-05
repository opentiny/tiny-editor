import { existsSync, readFileSync, renameSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

interface Manifest {
  version: string
  dependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}

export function getPackageManifest(pkgPath: string): Manifest {
  return JSON.parse(readFileSync(pkgPath, 'utf8')) as Manifest
}

export function rollupExternalFromPackage(pkgPath: string) {
  const { dependencies, peerDependencies, devDependencies } = getPackageManifest(pkgPath)
  const dependenciesKeys = Object.keys(dependencies ?? {})
  const peerDependenciesKeys = Object.keys(peerDependencies ?? {})
  const devDependenciesKeys = Object.keys(devDependencies ?? {})

  return (id: string) => {
    const packages = new Set([...peerDependenciesKeys, ...dependenciesKeys, ...devDependenciesKeys])
    return Array.from(packages).some(pkg => id === pkg || id.startsWith(`${pkg}/`))
  }
}

function rollupOutput(target: string, dir: string): any {
  return {
    format: target,
    entryFileNames: `[name].${target}.js`,
    preserveModules: true,
    dir: resolve(__dirname, 'dist', dir),
    preserveModulesRoot: resolve(__dirname, 'src'),
    exports: 'named',
    assetFileNames: (assetInfo: { name: string }) => {
      if (assetInfo.name === 'style.css') {
        return 'style.css'
      }
      return '[name][extname]'
    },
  }
}

export default defineConfig({
  plugins: [
    dts({ outDir: './dist/types', root: '.' }),
    {
      name: 'move-css-to-root',
      closeBundle: async () => {
        const targets = [
          resolve(__dirname, 'dist/es/style.css'),
          resolve(__dirname, 'dist/lib/style.css'),
        ]
        for (const source of targets) {
          if (existsSync(source)) {
            const destination = resolve(__dirname, 'dist/style.css')
            renameSync(source, destination)
          }
        }
      },
    },
  ],
  build: {
    sourcemap: true,
    minify: false,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'src/index.ts'),
        style: resolve(__dirname, 'src/assets/style.scss'),
      },
      treeshake: false,
      preserveEntrySignatures: 'allow-extension',
      external: rollupExternalFromPackage(resolve(__dirname, 'package.json')),
      output: [
        rollupOutput('es', 'es'),
        rollupOutput('cjs', 'lib'),
      ],
    },
  },
})
