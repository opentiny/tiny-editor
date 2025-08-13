# AI

通过配置 ai 模块和工具栏按钮，可以启用 AI 功能。

::: warning
这是一个实验中的功能，请勿用于生产环境。

该功能依赖于大模型的 API Key，无法在官网的 Demo 中进行体验。如果你想体验该功能，可以本地启动 TinyEditor 项目，并使用 Ollama 启动本地大模型；或者配置线上大模型的 host 和 apiKey。
:::

:::demo src=demos/ai.vue
:::

## API

`ai` 模块配置项：

```typescript
interface AIOption {
  // AI大模型主机地址，组件默认：'https://api.deepseek.com/v1'
  host: string
  // 大模型名称，组件默认：'deepseek-chat'
  model: string
  // API 密钥
  apiKey: string
  // 文本字数限制
  contentMaxLength?: number
}
```
