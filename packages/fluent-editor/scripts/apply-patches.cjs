const { execSync } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')

/*
 * 应用 Quill 补丁脚本
 * 功能：修复 Quill 编辑器输入法状态下的批处理问题，提升中文输入体验
 *
 * 自动应用：安装包时 postinstall 脚本自动应用，支持所有包管理器-受限于 postinstall 规则暂未实现
 *
 * 手动应用：在项目根目录执行
 *   node node_modules/@opentiny/fluent-editor/scripts/apply-patches.cjs
 *
 * 工作原理：
 *   1. 检测包管理器类型（pnpm/npm/yarn）
 *   2. 自动检测 Quill 安装位置
 *   3. 根据包管理器类型应用不同的补丁策略
 *
 * 注意事项：
 *   - 补丁是幂等的，多次运行无副作用
 *   - 需要 node_modules 写入权限
 *   - 不影响其他包或项目的补丁
 */

// 获取包管理器
function detectPackageManager() {
  try {
    const lockFiles = {
      'pnpm-lock.yaml': 'pnpm',
      'yarn.lock': 'yarn',
      'package-lock.json': 'npm',
    }

    for (const [file, manager] of Object.entries(lockFiles)) {
      if (fs.existsSync(file)) return manager
    }

    const userAgent = process.env.npm_config_user_agent || ''
    if (userAgent.includes('pnpm')) return 'pnpm'
    if (userAgent.includes('yarn')) return 'yarn'
    if (userAgent.includes('npm')) return 'npm'
  }
  catch {
    return 'npm'
  }

  return 'npm'
}

// 拷贝 patches 文件
function copyPatchFile() {
  const packageManager = detectPackageManager()
  // 把 patch 文件复制到哪里
  const dest = `patches/${packageManager === 'pnpm' ? 'quill@2.0.3.patch' : 'quill+2.0.3.patch'}`

  // 文件存在直接返回
  if (fs.existsSync(dest)) {
    return true
  }

  // 复制 patch 文件的路径
  const src = path.resolve(__dirname, '../patches/quill@2.0.3.patch')

  if (fs.existsSync(src)) {
    fs.mkdirSync('patches', { recursive: true })

    if (packageManager === 'pnpm') {
      fs.copyFileSync(src, dest)
    }
    else {
      let content = fs.readFileSync(src, 'utf-8')
      content = content.replaceAll('core/editor.js', 'node_modules/quill/core/editor.js')
      fs.writeFileSync(dest, content)
    }

    console.log(`✅ 已复制 patch 文件到 ${dest}`)
    return true
  }
  else {
    console.log(`⚠️  未找到 patch 文件，请手动创建 ${dest}`)
    return false
  }
}

// pnpm 应用 patch 文件
function setupPnpmPatch() {
  try {
    const packageJsonPath = 'package.json'
    if (!fs.existsSync(packageJsonPath)) {
      console.log('⚠️  未找到 package.json')
      return false
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

    // 检查是否已经有 pnpm.patchedDependencies 配置
    if (packageJson.pnpm?.patchedDependencies?.['quill@2.0.3']) {
      console.log('✅ pnpm patchedDependencies 已配置')
      return true
    }

    // 添加 pnpm.patchedDependencies 配置
    if (!packageJson.pnpm) {
      packageJson.pnpm = {}
    }

    if (!packageJson.pnpm.patchedDependencies) {
      packageJson.pnpm.patchedDependencies = {}
    }

    packageJson.pnpm.patchedDependencies['quill@2.0.3'] = 'patches/quill@2.0.3.patch'

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
    console.log('✅ 已添加 pnpm patchedDependencies 配置')

    try {
      execSync('pnpm install', { stdio: 'inherit' })
      console.log('✅ pnpm patch quill@2.0.3 应用成功！')
    }
    catch (error) {
      console.warn('❌ pnpm patch 命令执行失败：', error.message)
    }

    return true
  }
  catch (error) {
    console.error('❌ pnpm 补丁配置失败:', error.message)
    return false
  }
}

// npm、yarn 应用 patch 文件
function applyPatchPackage() {
  try {
    const packageManager = detectPackageManager()

    // 检查 patch-package 是否安装
    let patchPackageInstalled = false
    try {
      require.resolve('patch-package')
      patchPackageInstalled = true
    }
    catch (e) {
      // patch-package 未安装
    }

    if (!patchPackageInstalled) {
      console.log('📦 正在安装 patch-package...')
      try {
        const installCommand = packageManager === 'yarn' ? 'yarn add --dev patch-package' : 'npm install --save-dev patch-package'
        execSync(installCommand, { stdio: 'inherit' })
        console.log('✅ patch-package 安装成功')
      }
      catch (error) {
        console.error('❌ patch-package 安装失败:', error.message)
        return false
      }
    }

    // 应用补丁
    console.log('🔄 正在应用 patch...')
    try {
      execSync('npx patch-package', { stdio: 'inherit' })
      console.log('✅ 补丁应用成功')
    }
    catch (error) {
      console.error('❌ 补丁应用失败:', error.message)
      return false
    }

    // 添加 postinstall 脚本
    const packageJsonPath = 'package.json'
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

    if (!packageJson.scripts) {
      packageJson.scripts = {}
    }

    if (!packageJson.scripts.postinstall || !packageJson.scripts.postinstall.includes('patch-package')) {
      const existingPostinstall = packageJson.scripts.postinstall || ''
      packageJson.scripts.postinstall = existingPostinstall ? `${existingPostinstall} && npx patch-package` : 'npx patch-package'

      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
      console.log('✅ 已更新 postinstall 脚本')
    }

    return true
  }
  catch (error) {
    console.error('❌ patch-package 应用失败:', error.message)
    return false
  }
}

function handlePatchFailure() {
  console.log(`
❌ 补丁处理失败，请尝试手动安装

🔧 手动安装：
   在项目根目录执行：
   node node_modules/@opentiny/fluent-editor/scripts/apply-patches.cjs

⚠️  注意：未应用补丁可能影响中文输入体验
`)
}

function applyQuillPatch() {
  const packageManager = detectPackageManager()
  console.log(`🔍 检测到包管理器: ${packageManager}`)
  console.log('📋 准备 patch 文件...')

  if (!copyPatchFile()) return handlePatchFailure()

  let strategy
  if (packageManager == 'pnpm') {
    strategy = {
      label: '📦 使用 pnpm 补丁策略...',
      handler: setupPnpmPatch,
      successMsg: '✅ quill@2.0.3.patch 补丁配置已完成',
    }
  }
  else {
    strategy = {
      label: '📦 使用 patch-package 补丁策略...',
      handler: applyPatchPackage,
      successMsg: '🎉 补丁处理完成',
    }
  }

  if (!strategy) {
    console.log('❌ 不支持的包管理器，仅支持 pnpm、yarn、npm')
    handlePatchFailure()
    return
  }

  console.log(strategy.label)
  // 调用处理函数
  const success = strategy.handler()

  if (success) {
    console.log(strategy.successMsg)
  }
  else {
    handlePatchFailure()
  }
}

applyQuillPatch()
