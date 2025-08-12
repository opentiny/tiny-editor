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

export function bindAwarenessToCursors(
  awareness: Awareness,
  cursors: any,
  quill: any,
) {
  if (!cursors || !awareness) return

  awareness.on('change', () => {
    const states = awareness.getStates()
    states.forEach((state, clientId) => {
      if (clientId === awareness.clientID) return

      if (state.cursor) {
        const cursor = cursors.createCursor(
          clientId.toString(),
          state.user?.name || `User ${clientId}`,
          state.user?.color || '#ff6b6b',
        )
        cursors.moveCursor(clientId.toString(), state.cursor)
      }
      else {
        cursors.removeCursor(clientId.toString())
      }
    })
  })

  quill.on('selection-change', (range) => {
    if (range) {
      awareness.setLocalStateField('cursor', {
        index: range.index,
        length: range.length,
      })
    }
    else {
      awareness.setLocalStateField('cursor', null)
    }
  })
}
