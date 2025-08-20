import type { UnifiedProvider } from './provider/customProvider'
import type { YjsOptions } from './types'
import QuillCursors from 'quill-cursors'
import { Awareness } from 'y-protocols/awareness'
import { QuillBinding } from 'y-quill'
import * as Y from 'yjs'
import FluentEditor from '../../fluent-editor'
import { bindAwarenessToCursors, setupAwareness } from './awareness'
import { setupIndexedDB } from './awareness/y-indexeddb'
import { createProvider } from './provider/customProvider'

export class CollaborativeEditor {
  private ydoc: Y.Doc = new Y.Doc()
  private provider: UnifiedProvider
  private awareness: Awareness
  private cursors: QuillCursors | null
  private _isConnected = false
  private _isSynced = false
  private cleanupBindings: (() => void) | null = null

  constructor(
    public quill: FluentEditor,
    public options: YjsOptions,
  ) {
    FluentEditor.register('modules/cursors', QuillCursors, true)

    this.ydoc = this.options.ydoc || new Y.Doc()

    if (this.options.cursors !== false) {
      const cursorsOptions = typeof this.options.cursors === 'object' ? this.options.cursors : {}
      this.cursors = new QuillCursors(quill, cursorsOptions)
    }

    if (this.options.awareness) {
      const awareness = setupAwareness(this.options.awareness, new Awareness(this.ydoc))
      if (!awareness) {
        throw new Error('Failed to initialize awareness')
      }
      this.awareness = awareness
      this.cleanupBindings = bindAwarenessToCursors(this.awareness, this.cursors, quill) || null
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

  public destroy() {
    this.cleanupBindings?.()
    this.provider?.destroy?.()
    this.cursors?.clearCursors()
    this.awareness?.destroy?.()
    this.ydoc?.destroy?.()
  }
}
