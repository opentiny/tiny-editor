# 字符统计

实时显示编辑器中的字符数。

## 基本用法

通过配置 `counter` 为 true，可以开启字符统计功能。

:::demo src=examples/demos/counter.vue
:::

## 最大字符数

默认最大字符数为 500，通过配置 `count` 属性，可以自定义最大字符数。

:::demo src=examples/demos/counter-count.vue
:::

## API

`counter` 模块配置项：

```typescript
interface ICounterOption {
  format?: 'text' | 'html'
  unit?: 'char' | 'word'
  count?: number // 默认为 500
  template?: string | Function
  errorTemplate?: string | Function
}
```
