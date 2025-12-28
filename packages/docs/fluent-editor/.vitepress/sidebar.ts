export function sidebarDocs() {
  return [
    {
      text: '开始',
      items: [
        { text: '简介', link: '/docs/introduction' },
        { text: '快速开始', link: '/docs/quick-start' },
        { text: '在前端框架中使用', link: '/docs/used-in-framework' },
        { text: '核心架构与设计原则', link: '/docs/used-in-framework' },
      ],
    },
    {
      text: '基础',
      items: [
        { text: '安装与配置', link: '/docs/quick-start' },
        { text: '基础使用示例', link: '/docs/quick-start' },
        { text: '开发环境配置', link: '/docs/quick-start' },
      ],
    },
    {
      text: '模块',
      items: [
        { text: '理解 TinyEditor 类结构', link: '/docs/quick-start' },
        { text: '模块注册与配置', link: '/docs/quick-start' },
        { text: '创建自定义模块', link: '/docs/quick-start' },
      ],
    },
    {
      text: '格式',
      items: [
        { text: '内置格式扩展', link: '/docs/quick-start' },
        { text: '自定义格式开发', link: '/docs/quick-start' },
        { text: '格式注册与 Blot 系统', link: '/docs/quick-start' },
      ],
    },
    {
      text: '国际化与主题',
      items: [
        { text: '多语言支持实现', link: '/docs/quick-start' },
        { text: '主题定制与样式', link: '/docs/quick-start' },
        { text: '自定义主题开发', link: '/docs/quick-start' },
      ],
    },
    {
      text: '高级功能',
      items: [
        { text: '表格操作与管理', link: '/docs/quick-start' },
        { text: '图片与媒体处理', link: '/docs/quick-start' },
        { text: '剪贴板与粘贴处理', link: '/docs/quick-start' },
        { text: '协同编辑后端集成', link: '/docs/quick-start' },
        { text: 'AI模块集成', link: '/docs/quick-start' },
        { text: '思维导图', link: '/docs/quick-start' },
        { text: '流程图', link: '/docs/quick-start' },
      ],
    },
  ]
}

export function sidebarExamples() {
  return [
    {
      text: '使用示例',
      items: [
        { text: '基本用法', link: '/docs/demo/basic-usage' },
        { text: '内容初始化', link: '/docs/demo/set-content' },
        { text: '获取内容', link: '/docs/demo/get-content' },
        { text: '自定义工具栏', link: '/docs/demo/custom-toolbar' },
        { text: '增加工具栏', link: '/docs/demo/add-toolbar-item' },
        { text: '文件上传', link: '/docs/demo/file-upload' },
        { text: '代码块高亮', link: '/docs/demo/code-block-highlight' },
        { text: '表格', link: '/docs/demo/table-up' },
        { text: '@提醒', link: '/docs/demo/mention' },
        { text: '插入表情', link: '/docs/demo/emoji' },
        { text: '格式刷', link: '/docs/demo/format-painter' },
        { text: '公式', link: '/docs/demo/formula' },
        { text: 'Markdown', link: '/docs/demo/markdown' },
        { text: '字符统计', link: '/docs/demo/counter' },
        { text: '截屏', link: '/docs/demo/screenshot' },
        { text: '国际化', link: '/docs/demo/i18n' },
        { text: '标题列表', link: '/docs/demo/header-list' },
        { text: '工具栏提示', link: '/docs/demo/toolbar-tip' },
        { text: '只读模式', link: '/docs/demo/readonly' },
        { text: '模拟语雀文档', link: 'https://opentiny.github.io/tiny-editor/projects' },
        { text: '图片工具栏', link: '/docs/demo/image-tool' },
        { text: 'AI', link: '/docs/demo/ai' },
        { text: '思维导图', link: '/docs/demo/mind-map' },
        { text: '流程图', link: '/docs/demo/flow-chart' },
        { text: '协同编辑', link: '/docs/demo/collaborative-editing' },
      ],
    },
  ]
}

export function sidebarApi() {
  return [
    {
      text: 'API 参考',
      items: [
        { text: '配置项', link: '/docs/api/options' },
        { text: 'TinyEditor 实例', link: '/docs/api/fluent-editor-instance' },
        { text: 'TinyEditor 类', link: '/docs/api/fluent-editor-class' },
        { text: '事件系统与钩子', link: '/docs/api/fluent-editor-class' },
      ],
    },
  ]
}

export function sidebarModules() {
  return [
    {
      text: '模块生态',
      items: [
        { text: '工具栏提示', link: '/docs/modules/toolbar-tip' },
        { text: '标题列表', link: '/docs/modules/header-list' },
      ],
    },
  ]
}
