import type QuillCursors from 'quill-cursors'
import type { Awareness } from 'y-protocols/awareness'
import type FluentEditor from '../../../core/fluent-editor'

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
  cursorsModule: QuillCursors,
  quill: FluentEditor,
): (() => void) | void {
  if (!cursorsModule || !awareness) return

  let debounceTimer: NodeJS.Timeout | undefined
  const awarenessChangeHandler = () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    debounceTimer = setTimeout(() => {
      const states = awareness.getStates()
      states.forEach((state, clientId) => {
        if (clientId === awareness.clientID) return

        if (state.cursor) {
          cursorsModule.createCursor(
            clientId.toString(),
            state.user?.name || `User ${clientId}`,
            state.user?.color || '#ff6b6b',
          )
          cursorsModule.moveCursor(clientId.toString(), state.cursor)
        }
      })
    }, 100)
  }

  const selectionChangeHandler = (range: { index: number, length: number }) => {
    if (range) {
      awareness.setLocalStateField('cursor', {
        index: range.index,
        length: range.length,
      })
    }
    else {
      awareness.setLocalStateField('cursor', null)
    }
  }

  const changeHandler = ({ added, updated, removed }: { added: number[], updated: number[], removed: number[] }) => {
    removed.forEach((clientId) => {
      cursorsModule.removeCursor(clientId.toString())
    })
    awarenessChangeHandler()
  }

  awareness.on('change', changeHandler)
  quill.on('selection-change', range => selectionChangeHandler(range))
  awarenessChangeHandler()

  return () => {
    awareness.off('change', changeHandler)
    quill.off('selection-change', selectionChangeHandler)
  }
}
