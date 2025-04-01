<script setup lang="ts">
import type { MathliveModule } from '@opentiny/fluent-editor'
import type FluentEditor from '@opentiny/fluent-editor'
import { onMounted } from 'vue'

import 'mathlive'
import 'mathlive/static.css'
import 'mathlive/fonts.css'

let mathliveEditor: FluentEditor

const TOOLBAR_CONFIG = [
  [{ header: [] }],
  ['bold', 'italic', 'underline', 'link'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['clean'],
  ['formula'],
]

onMounted(() => {
  // ssr compat, reference: https://vitepress.dev/guide/ssr-compat#importing-in-mounted-hook
  import('@opentiny/fluent-editor').then((module) => {
    const FluentEditor = module.default

    mathliveEditor = new FluentEditor('#mathliveEditor', {
      theme: 'snow',
      modules: {
        toolbar: {
          container: TOOLBAR_CONFIG,
          handlers: {
            formula() {
              const mathlive = this.quill.getModule('mathlive') as MathliveModule
              mathlive.createDialog('e=mc^2')
            },
          },
        },
        mathlive: true,
      },
    })

    const html = '<p>正弦交流电的公式可以表示为<math-field class="ql-math-field view" contenteditable="false" mode="dialog">E = E_{max} \sin(\omega t + \phi)</math-field>，其中<math-field class="ql-math-field view" contenteditable="false" mode="dialog">E_{max}</math-field>表示最大值，<math-field class="ql-math-field view" contenteditable="false" mode="dialog">\omega</math-field>表示角频率，<math-field class="ql-math-field view" contenteditable="false" mode="dialog">t</math-field>表示时间，<math-field class="ql-math-field view" contenteditable="false" mode="dialog">\phi</math-field>表示初相位。公式中的<math-field class="ql-math-field view" contenteditable="false" mode="dialog">E_{max}</math-field>、<math-field class="ql-math-field view" contenteditable="false" mode="dialog">\omega</math-field>、<math-field class="ql-math-field view" contenteditable="false" mode="dialog">t</math-field>、<math-field class="ql-math-field view" contenteditable="false" mode="dialog">\phi</math-field>分别代表的含义是（）。</p>'

    mathliveEditor.root.innerHTML = html
  })
})
</script>

<template>
  <div id="mathliveEditor" />
</template>
