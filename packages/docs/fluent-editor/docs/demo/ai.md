# AI

通过模块配置AI。

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
