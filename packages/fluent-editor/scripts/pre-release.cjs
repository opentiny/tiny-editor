const fs = require('node:fs')
const path = require('node:path')
const program = require('commander')
const shelljs = require('shelljs')

shelljs.cp('-rf', 'package.json', 'dist')
const targetFile = path.resolve(__dirname, '../dist/package.json')
const packagejson = require(targetFile)

// 删除不需要发布到 npm 的字段
delete packagejson.scripts
delete packagejson.devDependencies
fs.writeFileSync(targetFile, JSON.stringify(packagejson, null, 2) + '\n');

const currentVersion = packagejson.version
const versionArr = currentVersion.split('.')
let defaultVersion = currentVersion

if (versionArr.length === 3) {
  // 普通版本号，比如：3.25.0
  const [mainVersion, subVersion, phaseVersion] = versionArr
  defaultVersion = `${mainVersion}.${subVersion}.${+phaseVersion + 1}`
}
else {
  // 带 tag 标记的版本号，比如：4.0.0-alpha.0
  const [mainVersion, subVersion, tagVersion, phaseVersion] = versionArr
  defaultVersion = `${mainVersion}.${subVersion}.${tagVersion}.${+phaseVersion + 1}`
}

let newVersion = defaultVersion

// 从命令行参数中取版本号
program
  .option('-v, --versions <type>', 'Add release version number', defaultVersion)

program.parse(process.argv)

if (program.versions) {
  newVersion = program.versions
}

function preRelease() {
  shelljs.sed('-i', `"version": "${currentVersion}"`, `"version": "${newVersion}"`, targetFile)
  shelljs.sed('-i', `"main": "src/index.ts"`, `"main": "lib/index.cjs.js"`, targetFile)
  shelljs.sed('-i', `"module": "src/index.ts"`, `"module": "es/index.es.js"`, targetFile)
  shelljs.sed('-i', `"types": "dist/types/index.d.ts"`, `"types": "types/index.d.ts"`, targetFile)
  shelljs.cp('-rf', '../../README.md', 'dist')
}

preRelease()
