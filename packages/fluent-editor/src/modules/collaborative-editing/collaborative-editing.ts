import type FluentEditor from '../../fluent-editor'
import type { YjsOptions } from './types'
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
  private _isConnected = false // 插件级别
  private _isSynced = false

  constructor(
    public quill: FluentEditor,
    private options: YjsOptions,
  ) {
    this.ydoc = this.options.ydoc || new Y.Doc()

    if (this.options.awareness) {
      this.awareness = setupAwareness(this.options.awareness, new Awareness(this.ydoc))
    }

    if (this.options.provider) {
      const providerConfig = this.options.provider
      try {
        // Create provider with shared handlers, Y.Doc, and Awareness
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

    if (this.options.offline) {
      setupIndexedDB(this.ydoc, typeof this.options.offline === 'object' ? this.options.offline : undefined)
    }
  }

  public getAwareness(): Awareness {
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
}
