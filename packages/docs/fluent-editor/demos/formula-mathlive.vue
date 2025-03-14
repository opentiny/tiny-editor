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
  })
})
</script>

<template>
  <div id="mathliveEditor" />
</template>
