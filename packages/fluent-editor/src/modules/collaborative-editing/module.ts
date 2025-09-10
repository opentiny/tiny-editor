import type FluentEditor from '../../fluent-editor'
import { CollaborativeEditor } from './collaborative-editing'

export class CollaborationModule {
  private collaborativeEditor: CollaborativeEditor

  constructor(public quill: FluentEditor, public options: any) {
    this.collaborativeEditor = new CollaborativeEditor(quill, options)

    window.addEventListener(
      'beforeunload',
      () => { void this.collaborativeEditor.destroy().catch(err => console.warn('[yjs] destroy failed:', err)) },
      { once: true },
    )
  }

  public getCursors() {
    return this.collaborativeEditor.getCursors()
  }

  public getAwareness() {
    return this.collaborativeEditor.getAwareness()
  }

  public getProvider() {
    return this.collaborativeEditor.getProvider()
  }

  public async destroy() {
    await this.collaborativeEditor.destroy()
  }
}
