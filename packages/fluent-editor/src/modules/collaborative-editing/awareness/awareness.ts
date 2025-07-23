import type { Awareness } from 'y-protocols/awareness'

export interface AwarenessState {
  name?: string
  color?: string
}

export interface AwarenessEvents {
  change?: (changes: { added: number[], updated: number[], removed: number[] }, transactionOrigin: any) => void
  update?: ({ added, updated, removed }: { added: number[], updated: number[], removed: number[] }, origin: any) => void
  destroy?: () => void
}

export interface AwarenessOptions {
  state?: AwarenessState
  events?: AwarenessEvents
  timeout?: number | undefined
}

export function setupAwareness(options?: AwarenessOptions, defaultAwareness?: Awareness): Awareness | null {
  if (!defaultAwareness) return null

  const awareness = defaultAwareness

  if (options?.state) {
    awareness.setLocalStateField('user', options.state)
  }

  return awareness
}
