import type QuillCursors from 'quill-cursors'
import type { Awareness } from 'y-protocols/awareness'
import type * as Y from 'yjs'
import type FluentEditor from '../../fluent-editor'
import type { UnifiedProvider } from './provider/providerRegistry'
import type { CollaborativeEditingDeps, YjsOptions } from './types'
import { bindAwarenessToCursors, setupAwareness } from './awareness'
import { setupIndexedDB } from './awareness/y-indexeddb'
import { createProvider } from './provider/providerRegistry'

export class CollaborativeEditor {
  private ydoc: Y.Doc
  private provider: UnifiedProvider
  private awareness: Awareness
  private cursors: QuillCursors | null
  private cleanupBindings: (() => void) | null = null
  private clearIndexedDB: (() => void) | null = null
  private deps: CollaborativeEditingDeps

  constructor(
    public quill: FluentEditor,
    public options: YjsOptions,
  ) {
    this.deps = this.options.deps || (window as any)
    const { Y, Awareness, QuillBinding, QuillCursors } = this.deps

    if (!Y || !Awareness || !QuillBinding || !QuillCursors) {
      throw new Error(
        'Missing required dependencies for collaborative editing. '
        + 'Please provide Y, Awareness, QuillBinding, and QuillCursors in the deps option.',
      )
    }

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
          onConnect: this.options.onConnect,
          onDisconnect: this.options.onDisconnect,
          onError: this.options.onError,
          onSyncChange: this.options.onSyncChange,
          deps: this.deps,
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
      this.cleanupBindings = bindAwarenessToCursors(this.awareness, this.cursors, quill, ytext, Y) || null
      new QuillBinding(
        ytext,
        this.quill,
        this.awareness,
      )
    }
    else {
      console.error('Failed to initialize collaborative editor: no valid provider configured')
    }

    if (this.options.offline !== false) {
      this.clearIndexedDB = setupIndexedDB(this.ydoc, this.deps.IndexeddbPersistence)
    }
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
    return this.provider?.isConnected ?? false
  }

  get isSynced() {
    return this.provider?.isSynced ?? false
  }

  public getCursors() {
    return this.cursors
  }

  public async destroy() {
    this.cleanupBindings?.()
    this.provider?.destroy?.()
    this.cursors?.clearCursors()
    this.awareness?.destroy?.()
    this.clearIndexedDB?.()
    this.ydoc?.destroy?.()
  }
}
