import type { BlotFormatter } from '../blot-formatter'

export class Action {
  formatter: BlotFormatter

  constructor(formatter: BlotFormatter) {
    this.formatter = formatter
  }

  onCreate() {}

  onDestroy() {}

  onUpdate() {}
}
