import type QuillCursors from 'quill-cursors'
import type { Awareness } from 'y-protocols/awareness'
import type FluentEditor from '../../../core/fluent-editor'
import * as Y from 'yjs'

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
  yText: Y.Text,
): (() => void) | void {
  if (!cursorsModule || !awareness) return

  const doc = yText.doc!

  const updateCursor = (clientId: number, state: any) => {
    try {
      if (state?.cursor && clientId !== awareness.clientID) {
        const user = state.user || {}
        const color = user.color || '#ff6b6b'
        const name = user.name || `User ${clientId}`

        cursorsModule.createCursor(clientId.toString(), name, color)

        const anchor = Y.createAbsolutePositionFromRelativePosition(Y.createRelativePositionFromJSON(state.cursor.anchor), doc)
        const head = Y.createAbsolutePositionFromRelativePosition(Y.createRelativePositionFromJSON(state.cursor.head), doc)

        if (anchor && head && anchor.type === yText && clientId) {
          setTimeout(() => {
            cursorsModule.moveCursor(clientId.toString(), {
              index: anchor.index,
              length: head.index - anchor.index,
            })
          }, 0)
        }
      }
      else {
        cursorsModule.removeCursor(clientId.toString())
      }
    }
    catch (err) {
      console.error('Cursor update failed:', err)
    }
  }

  const selectionChangeHandler = (range: { index: number, length: number } | null) => {
    setTimeout(() => {
      if (range) {
        const anchor = Y.createRelativePositionFromTypeIndex(yText, range.index)
        const head = Y.createRelativePositionFromTypeIndex(yText, range.index + range.length)

        const currentState = awareness.getLocalState()
        if (!currentState?.cursor
          || !Y.compareRelativePositions(anchor, currentState.cursor.anchor)
          || !Y.compareRelativePositions(head, currentState.cursor.head)) {
          awareness.setLocalStateField('cursor', { anchor, head })
        }
      }
      else {
        if (awareness.getLocalState()?.cursor !== null) {
          awareness.setLocalStateField('cursor', null)
        }
      }
    }, 0)
  }

  const changeHandler = ({ added, updated, removed }: {
    added: number[]
    updated: number[]
    removed: number[]
  }) => {
    if (quill.composition.isComposing) return
    const states = awareness.getStates()

    added.forEach((id) => {
      updateCursor(id, states.get(id))
    })

    updated.forEach((id) => {
      updateCursor(id, states.get(id))
    })

    removed.forEach((id) => {
      cursorsModule.removeCursor(id.toString())
    })
  }

  awareness.on('change', changeHandler)
  quill.on('editor-change', (eventName, ...args) => {
    if (quill.composition.isComposing) return
    if (eventName === 'text-change') {
      if (args[2] === 'user') {
        const range = quill.getSelection()
        selectionChangeHandler(range)
      }
    }
    else if (eventName === 'selection-change') {
      if (args[2] === 'user') {
        selectionChangeHandler(args[0] as { index: number, length: number } | null)
      }
    }
  })

  awareness.getStates().forEach((state, clientId) => {
    updateCursor(clientId, state)
  })

  return () => {
    awareness.off('change', changeHandler)
    quill.off('editor-change', selectionChangeHandler)
  }
}
