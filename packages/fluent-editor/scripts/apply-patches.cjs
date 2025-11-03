const { execSync } = require('node:child_process')
const fs = require('node:fs')

/*
 * Fluent Editor Quill 补丁脚本
 *
 * 功能：修复 Quill 编辑器输入法状态下的批处理问题，提升中文输入体验
 *
 * 自动应用：安装包时 postinstall 脚本自动应用，支持所有包管理器
 *
 * 手动应用：在项目根目录执行
 *   node node_modules/@opentiny/fluent-editor/scripts/apply-patches.cjs
 *
 * 工作原理：
 *   1. 检测包管理器类型（pnpm/npm/yarn）
 *   2. 自动检测 Quill 安装位置
 *   3. 根据包管理器类型应用不同的补丁策略
 *   4. 支持直接修改或使用 patch-package
 *
 * 注意事项：
 *   - 补丁是幂等的，多次运行无副作用
 *   - 需要 node_modules 写入权限
 *   - 不影响其他包或项目的补丁
 */

function detectPackageManager() {
  try {
    // 优先检查 lockfile 文件，这是最可靠的检测方式
    if (fs.existsSync('pnpm-lock.yaml')) {
      return 'pnpm'
    }
    if (fs.existsSync('yarn.lock')) {
      return 'yarn'
    }
    if (fs.existsSync('package-lock.json')) {
      return 'npm'
    }

    // 检查环境变量
    if (process.env.npm_config_user_agent) {
      const userAgent = process.env.npm_config_user_agent
      if (userAgent.includes('pnpm')) return 'pnpm'
      if (userAgent.includes('yarn')) return 'yarn'
      if (userAgent.includes('npm')) return 'npm'
    }

    return 'npm' // 默认使用 npm
  }
  catch (error) {
    return 'npm' // 默认使用 npm
  }
}

function showManualInstallTip() {
  console.log('')
  console.log('🔧 手动安装：')
  console.log('   在项目根目录执行：')
  console.log('   node node_modules/@opentiny/fluent-editor/scripts/apply-patches.cjs')
  console.log('')
  console.log('⚠️  注意：未应用补丁可能影响中文输入体验')
  console.log('')
}

function copyPatchFile() {
  const patchFilePath = 'patches/quill@2.0.3.patch'
  if (!fs.existsSync(patchFilePath)) {
    // 从 fluent-editor 的 dist/patches 复制
    const fluentEditorPath = 'node_modules/@opentiny/fluent-editor/patches/quill@2.0.3.patch'
    if (fs.existsSync(fluentEditorPath)) {
      fs.mkdirSync('patches', { recursive: true })
      fs.copyFileSync(fluentEditorPath, patchFilePath)
      console.log('✅ 已复制 patch 文件到 patches/quill@2.0.3.patch')
      return true
    }
    else {
      console.log('⚠️  未找到 patch 文件，请手动创建 patches/quill@2.0.3.patch')
      return false
    }
  }
  return true
}

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

    // 执行 pnpm patch quill@2.0.3
    console.log('🔄 正在执行 pnpm patch quill@2.0.3...')
    try {
      execSync('pnpm patch quill@2.0.3', { stdio: 'inherit' })
      console.log('✅ pnpm patch 命令执行成功')
    }
    catch (error) {
      console.warn('❌ pnpm patch 命令执行失败，请手动执行 pnpm patch quill@2.0.3 应用 patch')
    }

    return true
  }
  catch (error) {
    console.error('❌ pnpm 补丁配置失败:', error.message)
    return false
  }
}

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
        const installCommand = packageManager === 'yarn'
          ? 'yarn add --dev patch-package'
          : 'npm install --save-dev patch-package'
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
      packageJson.scripts.postinstall = existingPostinstall
        ? `${existingPostinstall} && npx patch-package`
        : 'npx patch-package'

      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
      console.log('✅ 已添加 postinstall 脚本')
    }

    return true
  }
  catch (error) {
    console.error('❌ patch-package 应用失败:', error.message)
    return false
  }
}

function handlePatchFailure() {
  console.log('❌ 补丁处理失败，请尝试手动安装')
  showManualInstallTip()
}

function applyQuillPatch() {
  const packageManager = detectPackageManager()
  console.log(`🔍 检测到包管理器: ${packageManager}`)

  // 首先统一复制 patch 文件
  console.log('📋 准备 patch 文件...')
  if (!copyPatchFile()) {
    handlePatchFailure()
    return
  }

  let success = false
  let completionMessage = ''

  switch (packageManager) {
    case 'pnpm':
      console.log('📦 使用 pnpm 补丁策略...')
      success = setupPnpmPatch()
      if (success) {
        completionMessage = '✅ quill@2.0.3.patch 补丁配置已完成'
      }
      break

    case 'npm':
    case 'yarn':
      console.log('📦 使用 patch-package 补丁策略...')
      success = applyPatchPackage()
      if (success) {
        completionMessage = '🎉 补丁处理完成'
      }
      break

    default:
      console.log('❌ 不支持的包管理器')
      console.log('')
      console.log('支持的包管理器：')
      console.log('  • pnpm (推荐) - 使用 patchedDependencies')
      console.log('  • npm - 使用 patch-package')
      console.log('  • yarn - 使用 patch-package')
      console.log('')
      console.log('请使用支持的包管理器来安装 Fluent Editor')
      handlePatchFailure()
      return
  }

  if (success) {
    console.log(completionMessage)
  }
  else {
    handlePatchFailure()
  }
}

applyQuillPatch()
