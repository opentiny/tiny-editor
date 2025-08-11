import type FluentEditor from '../../fluent-editor'
import type { YjsOptions } from './types'
import QuillCursors from 'quill-cursors'
import { Awareness } from 'y-protocols/awareness'
import { QuillBinding } from 'y-quill'
import * as Y from 'yjs'
import { setupAwareness } from './awareness'
import { setupIndexedDB } from './awareness/y-indexeddb'
import { createProvider } from './provider/customProvider'

export class CollaborativeEditor {
  private ydoc: Y.Doc = new Y.Doc()
  private provider: any
  private awareness: Awareness
  private cursors: any
  private _isConnected = false
  private _isSynced = false

  constructor(
    public quill: FluentEditor,
    public options: YjsOptions,
  ) {
    this.ydoc = this.options.ydoc || new Y.Doc()

    const cursorsOptions = typeof this.options.cursors === 'object' ? this.options.cursors : {}
    this.cursors = new QuillCursors(quill, cursorsOptions)
    console.log('cursors', this.cursors)

    if (this.options.awareness) {
      const awareness = setupAwareness(this.options.awareness, new Awareness(this.ydoc))
      if (!awareness) {
        throw new Error('Failed to initialize awareness')
      }
      this.awareness = awareness
      this.bindAwarenessToCursors()
    }
    else {
      this.awareness = new Awareness(this.ydoc)
    }

    if (this.options.provider) {
      const providerConfig = this.options.provider
      try {
        const provider = createProvider({
          doc: this.ydoc,
          options: providerConfig.options,
          type: providerConfig.type,
          awareness: this.awareness,
          onConnect: () => {
            this._isConnected = true
            this.options.onConnect?.()
          },
          onDisconnect: () => {
            this._isConnected = false
            this.options.onDisconnect?.()
          },
          onError: (error) => {
            this.options.onError?.(error)
          },
          onSyncChange: (isSynced) => {
            this._isSynced = isSynced
            this.options.onSyncChange?.(isSynced)
          },
        })
        this.provider = provider
      }
      catch (error) {
        console.warn(
          `[yjs] Error creating provider of type ${providerConfig.type}:`,
          error,
        )
      }
    }

    if (this.provider) {
      const ytext = this.ydoc.getText('tiny-editor')
      new QuillBinding(
        ytext,
        this.quill,
        this.awareness,
      )
    }
    else {
      console.error('Failed to initialize collaborative editor: no valid provider configured')
    }

    if (this.options.offline !== false)
      setupIndexedDB(this.ydoc, typeof this.options.offline === 'object' ? this.options.offline : undefined)
  }

  private bindAwarenessToCursors() {
    if (!this.cursors || !this.awareness) return

    this.awareness.on('change', () => {
      const states = this.awareness.getStates()

      states.forEach((state, clientId) => {
        if (clientId === this.awareness.clientID) return

        if (state.cursor) {
          const cursor = this.cursors.createCursor(
            clientId.toString(),
            state.user?.name || `User ${clientId}`,
            state.user?.color || '#ff6b6b',
          )
          this.cursors.moveCursor(clientId.toString(), state.cursor)
        }
        else {
          this.cursors.removeCursor(clientId.toString())
        }
      })
    })

    this.quill.on('selection-change', (range) => {
      if (range) {
        this.awareness.setLocalStateField('cursor', {
          index: range.index,
          length: range.length,
        })
      }
      else {
        this.awareness.setLocalStateField('cursor', null)
      }
    })
  }

  public getAwareness() {
    return this.awareness
  }

  public getProvider() {
    return this.provider
  }

  public getYDoc() {
    return this.ydoc
  }

  get isConnected() {
    return this._isConnected
  }

  get isSynced() {
    return this._isSynced
  }

  public getCursors() {
    return this.cursors
  }
}
