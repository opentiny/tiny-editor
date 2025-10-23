import type { Theme } from 'vitepress'
import DemoPreview, { useComponents } from '@vitepress-code-preview/container'
import DefaultTheme from 'vitepress/theme'
import * as Toast from 'vue-toastification'
import TranslateComponent from '../components/TranslateComponent.vue'
import { insertBaiduScript } from './insert-baidu-script'
import { inertDepsVersion } from './insert-deps-version'
import { insertTranslate } from './insert-translate'
import '@vitepress-code-preview/container/dist/style.css'
import './style.css'
import 'vue-toastification/dist/index.css'

export const define = <T>(value: T): T => value
export default define<Theme>({
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('TranslateComponent', TranslateComponent)
    app.use(Toast.default, {
      position: 'top-center',
      timeout: 3000,
      hideProgressBar: true,
    })
    useComponents(app, DemoPreview)
    insertBaiduScript()
    inertDepsVersion()
    setTimeout(() => {
      insertTranslate()
    }, 3000)
  },
})
