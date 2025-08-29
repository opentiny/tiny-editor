export function sidebar() {
  return [
    { text: '快速开始', link: '/docs/quick-start' },
    { text: '在前端框架中使用', link: '/docs/used-in-framework' },
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
        { text: '流程图', link: '/docs/demo/flow-chart' },
      ],
    },
    {
      text: 'API 参考',
      items: [
        { text: '配置项', link: '/docs/api/options' },
        { text: 'TinyEditor 实例', link: '/docs/api/fluent-editor-instance' },
        { text: 'TinyEditor 类', link: '/docs/api/fluent-editor-class' },
      ],
    },
    {
      text: '模块生态',
      items: [
        { text: '工具栏提示', link: '/docs/modules/toolbar-tip' },
        { text: '标题列表', link: '/docs/modules/header-list' },
      ],
    },
  ]
}
