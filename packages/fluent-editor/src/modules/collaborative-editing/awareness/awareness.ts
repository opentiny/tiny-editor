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

interface QuillCursors {
  createCursor: (id: string, name: string, color: string) => any
  moveCursor: (id: string, range: { index: number, length: number }) => void
  removeCursor: (id: string) => void
}

interface QuillEditor {
  on: (event: 'selection-change', handler: (range: { index: number, length: number } | null) => void) => void
  off: (event: 'selection-change', handler: Function) => void
}

export function bindAwarenessToCursors(
  awareness: Awareness,
  cursorsModule: QuillCursors,
  quill: FluentEditor,
): (() => void) | void {
  if (!cursorsModule || !awareness) return

  const awarenessChangeHandler = (changes?: { added: number[], updated: number[], removed: number[] }) => {
    if (changes?.removed?.length) {
      changes.removed.forEach((clientId) => {
        cursorsModule.removeCursor(clientId.toString())
      })
    }

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
      else {
        cursorsModule.removeCursor(clientId.toString())
      }
    })
  }

  const selectionChangeHandler = (range) => {
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

  awareness.on('change', awarenessChangeHandler)
  quill.on('selection-change', selectionChangeHandler)
  awarenessChangeHandler()

  return () => {
    awareness.off('change', awarenessChangeHandler)
    quill.off('selection-change', selectionChangeHandler)
  }
}
