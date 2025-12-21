const fs = require('node:fs')
const path = require('node:path')
const program = require('commander')
const shelljs = require('shelljs')

shelljs.cp('-rf', 'package.json', 'dist')
const targetFile = path.resolve(__dirname, '../dist/package.json')
const packagejson = require(targetFile)

packagejson.exports = {
  '.': {
    import: './es/index.es.js',
    require: './lib/index.cjs.js',
    types: './types/index.d.ts',
  },
  './style.css': './style.css',
  './package.json': './package.json',
}

// 删除不需要发布到 npm 的字段
delete packagejson.scripts
delete packagejson.devDependencies
fs.writeFileSync(targetFile, `${JSON.stringify(packagejson, null, 2)}\n`)

let defaultVersion = packagejson.version
let newVersion = defaultVersion

// 从命令行参数中取版本号
program
  .option('-v, --versions <type>', 'Add release version number', defaultVersion)

program.parse(process.argv)

if (program.versions) {
  newVersion = program.versions
}

function preRelease() {
  shelljs.sed('-i', `"version": "${defaultVersion}"`, `"version": "${newVersion}"`, targetFile)
  shelljs.sed('-i', `"main": "src/index.ts"`, `"main": "es/index.es.js"`, targetFile)
  shelljs.sed('-i', `"module": "src/index.ts"`, `"module": "es/index.es.js"`, targetFile)
  shelljs.sed('-i', `"types": "dist/types/index.d.ts"`, `"types": "types/index.d.ts"`, targetFile)
  shelljs.cp('-rf', '../../README.md', 'dist')

  // 创建 scripts 目录并复制自定义补丁脚本
  shelljs.mkdir('-p', path.resolve(__dirname, '../dist/scripts'))
  shelljs.cp('-rf', path.resolve(__dirname, 'apply-patches.cjs'), path.resolve(__dirname, '../dist/scripts/'))

  // 复制 patches 目录到 dist
  const patchesSourceDir = path.resolve(__dirname, '../../../patches')
  const patchesTargetDir = path.resolve(__dirname, '../dist/patches')
  if (shelljs.test('-d', patchesSourceDir)) {
    shelljs.mkdir('-p', patchesTargetDir)
    shelljs.cp('-rf', `${patchesSourceDir}/*`, patchesTargetDir)
    console.log('✅ Patches copied to dist/patches')
  }
}

preRelease()
