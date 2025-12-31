export function sidebarDocs() {
  return [
    {
      text: '开始',
      items: [
        { text: '简介', link: '/docs/introduction' },
        { text: '快速开始', link: '/docs/quick-start' },
        { text: '在前端框架中使用', link: '/docs/used-in-framework' },
        { text: '核心架构与设计原则', link: '/docs/core-architecture-and-design-principles' },
      ],
    },
    {
      text: '基础',
      items: [
        { text: '安装与配置', link: '/docs/installation-and-setup' },
        { text: '基础使用示例', link: '/docs/basic-usage-examples' },
        { text: '开发环境配置', link: '/docs/development-environment-setup' },
      ],
    },
    {
      text: '模块',
      items: [
        { text: '理解 TinyEditor 类结构', link: '/docs/understanding-tiny-editor-class-structure' },
        { text: '模块注册与配置', link: '/docs/module-registration-and-configuration' },
        { text: '创建自定义模块', link: '/docs/creating-custom-modules' },
      ],
    },
    {
      text: '格式',
      items: [
        { text: '内置格式扩展', link: '/docs/built-in-format-extensions' },
        { text: '自定义格式开发', link: '/docs/custom-format-development' },
        { text: '格式注册与 Blot 系统', link: '/docs/format-registration-and-blot-system' },
      ],
    },
    {
      text: '国际化与主题',
      items: [
        { text: '多语言支持实现', link: '/docs/multi-language-support-implementation' },
        { text: '主题定制与样式', link: '/docs/theme-customization-and-styling' },
        { text: '自定义主题开发', link: '/docs/custom-theme-development' },
      ],
    },
    {
      text: '高级功能',
      items: [
        { text: '表格操作与管理', link: '/docs/table-operations-and-management' },
          { text: '图片与媒体处理', link: '/docs/image-and-media-handling' },
        { text: '剪贴板与粘贴处理', link: '/docs/clipboard-and-paste-processing' },
        { text: '协同编辑后端集成', link: '/docs/collaborative-editing-backend-integration' },
      ],
    },
  ]
}

export function sidebarExamples() {
  return [
    {
      text: '使用示例',
      items: [
        { text: '基本用法', link: '/examples/basic-usage' },
        { text: '内容初始化', link: '/examples/set-content' },
        { text: '获取内容', link: '/examples/get-content' },
        { text: '自定义工具栏', link: '/examples/custom-toolbar' },
        { text: '增加工具栏', link: '/examples/add-toolbar-item' },
        { text: '文件上传', link: '/examples/file-upload' },
        { text: '代码块高亮', link: '/examples/code-block-highlight' },
        { text: '表格', link: '/examples/table-up' },
        { text: '@提醒', link: '/examples/mention' },
        { text: '插入表情', link: '/examples/emoji' },
        { text: '格式刷', link: '/examples/format-painter' },
        { text: '公式', link: '/examples/formula' },
        { text: 'Markdown', link: '/examples/markdown' },
        { text: '字符统计', link: '/examples/counter' },
        { text: '截屏', link: '/examples/screenshot' },
        { text: '国际化', link: '/examples/i18n' },
        { text: '标题列表', link: '/examples/header-list' },
        { text: '工具栏提示', link: '/examples/toolbar-tip' },
        { text: '只读模式', link: '/examples/readonly' },
        { text: '模拟语雀文档', link: 'https://opentiny.github.io/tiny-editor/projects' },
        { text: '图片工具栏', link: '/examples/image-tool' },
        { text: 'AI', link: '/examples/ai' },
        { text: '思维导图', link: '/examples/mind-map' },
        { text: '流程图', link: '/examples/flow-chart' },
        { text: '协同编辑', link: '/examples/collaborative-editing' },
      ],
    },
  ]
}

export function sidebarApi() {
  return [
    {
      text: 'API 参考',
      items: [
        { text: '配置项', link: '/api/options' },
        { text: 'TinyEditor 实例', link: '/api/fluent-editor-instance' },
        { text: 'TinyEditor 类', link: '/api/fluent-editor-class' },
        { text: '事件系统与钩子', link: '/api/event-system-and-hooks' },
      ],
    },
  ]
}

export function sidebarModules() {
  return [
    {
      text: '模块生态',
      items: [
        { text: '工具栏提示', link: '/modules/toolbar-tip' },
        { text: '标题列表', link: '/modules/header-list' },
      ],
    },
  ]
}
