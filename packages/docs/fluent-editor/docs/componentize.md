# 封装成组件

如果项目中有很多地方都需要使用富文本编辑器，那么可以考虑将 TinyEditor 封装成组件。

下面以 Vue 组件为例，教大家如何将 TinyEditor 封装成组件。

## 组件封装

创建一个 `TinyEditor.vue` 组件文件。

在里面写入以下内容：

```vue
<script setup lang="ts">
import FluentEditor from '@opentiny/fluent-editor'
import { onMounted, ref, watch } from 'vue'

// Props 和 Emits 定义
const props = withDefaults(defineProps<{
  modelValue: string
  options?: Record<string, any>
}>(), {
  options: () => ({ theme: 'snow' }),
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// 编辑器实例和容器引用
let editor: FluentEditor
const editorRef = ref<HTMLElement>()
const isInitialized = ref(false)

// 监听 v-model 值的变化（外部值变化时更新编辑器）
watch(
  () => props.modelValue,
  (newValue) => {
    if (isInitialized.value && editor && newValue !== editor.root.innerHTML) {
      // 如果是 HTML 字符串，需要通过 Delta 格式设置内容
      // 不推荐用 editor.root.innerHTML = html 的方式设置内容
      const delta = editor.clipboard.convert({ html: newValue })
      editor.setContents(delta, 'silent')
    }
  },
)

// 初始化编辑器
onMounted(async () => {
  if (editorRef.value) {
    editor = new FluentEditor(editorRef.value, props.options)

    // 编辑器内容变化时触发 update:modelValue
    editor.on('text-change', () => {
      const html = editor.root.innerHTML
      emit('update:modelValue', html)
    })

    // 初始化编辑器内容
    if (props.modelValue) {
      const delta = editor.clipboard.convert({ html: props.modelValue })
      editor.setContents(delta, 'silent')
    }

    isInitialized.value = true
  }
})
</script>

<template>
  <div class="editor-container">
    <div ref="editorRef" class="editor-content" />
  </div>
</template>
```

## 组件使用

封装成组件之后，使用起来就很方便了，直接给 TinyEditor 组件设置 v-model，传入一段 HTML 字符串就行了。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import TinyEditor from './TinyEditor.vue'

// 使用 v-model 绑定编辑器内容
const editorContent = ref('<p>Hello <strong>Fluent Editor</strong></p><p><a href="https://opentiny.github.io/tiny-editor/">https://opentiny.github.io/tiny-editor/</a></p>')
</script>

<template>
  <div class="demo-editor">
    <h2>编辑器示例</h2>
    <TinyEditor v-model="editorContent" />
    <h3>当前内容：</h3>
    <div>{{ editorContent }}</div>
  </div>
</template>
```

当然你也可以把 v-model 的值设置成 delta 格式，或者给你封装的组件添加更多功能和 API。
