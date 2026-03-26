import { FLOW_CHART_EN_US } from './en-us'
import { FLOW_CHART_ZH_CN } from './zh-cn'

export function registerFlowChartI18N(i18nModule: any) {
  i18nModule.addMessages('en-US', FLOW_CHART_EN_US)
  i18nModule.addMessages('zh-CN', FLOW_CHART_ZH_CN)
}
