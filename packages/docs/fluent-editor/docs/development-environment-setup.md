# 开发环境配置

搭建适当的开发环境对于为 TinyEditor 做贡献至关重要。本指南将引导你完成整个流程，从克隆代码仓库到运行开发服务器。

前置条件
开始之前，请确保已安装以下工具：

Node.js：版本 18 或更高
pnpm：版本 9.13.0（项目的包管理器）
Git：用于版本控制
必须使用 pnpm，因为本项目使用 pnpm workspaces 进行 monorepo 管理。其他包管理器可能无法正常工作。


项目架构概述
TinyEditor 采用包含多个包的 monorepo 结构：










快速设置流程
设置过程可以可视化为一个简化的工作流：





分步设置
1. 克隆代码仓库
git clone git@github.com:opentiny/tiny-editor.git
cd tiny-editor
2. 安装依赖
项目使用 pnpm workspaces 管理多个包。使用以下命令安装所有依赖：

pnpm i
这将为 monorepo 中的所有包安装依赖，包括：

核心编辑器库
文档站点
示例项目
协作编辑后端
3. 启动开发服务器
对于一般开发，使用主要的开发命令：

pnpm dev
这将在 http://localhost:5173/tiny-editor/ 启动文档开发服务器 README.md。

开发工作流
核心库开发
要开发核心 fluent-editor 库：

pnpm watch
此命令以监听模式构建库，当源文件更改时自动重新构建 package.json。

文档开发
要开发文档：

# 文档开发服务器
pnpm -F docs dev
文档站点使用 VitePress，包含交互式演示和示例 packages/docs/package.json。

示例项目开发
要开发示例项目：

# 启动示例开发服务器
pnpm dev:projects
这将运行展示 TinyEditor 各种功能的示例项目 package.json。

协作后端开发
对于协作编辑功能：

# 启动协作后端
pnpm -F collaborative-editing-backend dev
这将为实时协作编辑启动 WebSocket 服务器 packages/collaborative-editing-backend/package.json。

包结构
Package	用途	开发命令
fluent-editor	核心编辑器库	pnpm watch
docs	文档站点	pnpm -F docs dev
projects	示例项目	pnpm dev:projects
collaborative-editing-backend	实时协作服务器	pnpm -F collaborative-editing-backend dev
构建命令
库构建
# 构建库用于发布
pnpm build:lib
这将构建库，同时输出 ES modules 和 CommonJS 格式 packages/fluent-editor/vite.config.ts。

文档构建
# 构建文档用于生产环境
pnpm build
项目构建
# 构建示例项目
pnpm build:projects
测试
项目使用 Jest 进行单元测试，使用 Playwright 进行端到端测试：

# 运行单元测试
pnpm test
 
# 运行 E2E 测试
pnpm -F docs test
 
# 安装 E2E 测试的浏览器依赖
pnpm install:browser
代码质量
项目使用 ESLint 配合 Antfu 配置来保证代码质量：

# 检查所有文件
pnpm lint
 
# 修复检查问题
pnpm lint:fix
ESLint 配置支持 TypeScript、Vue，并强制执行一致的代码风格 eslint.config.mjs。

Git 钩子
项目使用 pre-commit 钩子来确保代码质量：

Pre-commit：运行 lint-staged 修复检查问题
Commit-msg：使用 verifyCommit.js 验证提交信息 package.json
开发技巧
开发核心库时，使用 pnpm watch 自动重新构建更改。库会以 ES modules 和 CommonJS 两种格式输出到 dist/ 目录。

Workspace 依赖
包使用 workspace 依赖（workspace:^）相互引用，确保在开发期间始终使用最新的本地版本 packages/fluent-editor/package.json。

补丁管理
项目使用 pnpm patches 修改 Quill 依赖。补丁文件位于 patches/quill@2.0.3.patch package.json。

后续步骤
设置好开发环境后，你可以：

探索核心架构和设计原则以了解编辑器的内部结构
学习理解 FluentEditor 类结构获取详细的 API 知识
查看基本用法示例了解编辑器的实际运行效果
开发环境为你提供了为 TinyEditor 做贡献所需的一切，无论是修复错误、添加功能还是改进文档。