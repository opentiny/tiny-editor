const fs = require('node:fs')
const path = require('node:path')

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
 *   1. 自动检测 Quill 安装位置
 *   2. 检查是否已打补丁（避免重复）
 *   3. 修改 quill/core/editor.js 的 applyDelta 方法
 *   4. 添加批处理状态检查，避免输入法期间的重复操作
 *
 * 注意事项：
 *   - 补丁是幂等的，多次运行无副作用
 *   - 需要 node_modules 写入权限
 *   - 不影响其他包或项目的补丁
 */

function showManualInstallTip() {
  console.log('')
  console.log('🔧 手动安装：')
  console.log('   在项目根目录执行：')
  console.log('   node node_modules/@opentiny/fluent-editor/scripts/apply-patches.cjs')
  console.log('')
  console.log('⚠️  注意：未应用补丁可能影响中文输入体验')
  console.log('')
}

function applyQuillPatch() {
  try {
    const quillPath = require.resolve('quill')
    const quillDir = path.dirname(quillPath)
    const editorJsPath = path.join(quillDir, 'core', 'editor.js')

    if (!fs.existsSync(editorJsPath)) {
      console.log('⚠️  未找到 Quill editor.js，跳过补丁')
      showManualInstallTip()
      return
    }

    let content = fs.readFileSync(editorJsPath, 'utf8')

    // 检查是否已经打过补丁
    if (content.includes('isAlreadyBatching')) {
      console.log('✅ Quill 补丁已应用')
      return
    }

    // 应用补丁 - 修改 applyDelta 方法
    const originalBatchStart = 'this.scroll.batchStart();'
    const patchedBatchStart = `// Check if a batch already exists (e.g. during composition)
    const isAlreadyBatching = Boolean(this.scroll.batch);

    if (!isAlreadyBatching) {
      this.scroll.batchStart();
    }`

    const originalBatchEnd = 'this.scroll.batchEnd();'
    const patchedBatchEnd = `if (!isAlreadyBatching) {
      this.scroll.batchEnd();
    }`

    content = content.replace(originalBatchStart, patchedBatchStart)
    content = content.replace(originalBatchEnd, patchedBatchEnd)

    fs.writeFileSync(editorJsPath, content)
    console.log('✅ Quill 补丁应用成功')
  }
  catch (error) {
    console.error('❌ Quill 补丁应用失败:', error.message)
    showManualInstallTip()
  }
}

applyQuillPatch()
