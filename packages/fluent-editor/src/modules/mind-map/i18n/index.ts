import { MIND_MAP_EN_US } from './en-us'
import { MIND_MAP_ZH_CN } from './zh-cn'

export function registerMindMapI18N(i18nModule: any) {
  i18nModule.addMessages('en-US', MIND_MAP_EN_US)
  i18nModule.addMessages('zh-CN', MIND_MAP_ZH_CN)
}
