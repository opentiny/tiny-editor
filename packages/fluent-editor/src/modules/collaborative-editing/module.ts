import type FluentEditor from '../../fluent-editor'
import { CollaborativeEditor } from './collaborative-editing'

export class CollaborationModule {
  private collaborativeEditor: CollaborativeEditor

  constructor(public quill: FluentEditor, public options: any) {
    this.collaborativeEditor = new CollaborativeEditor(quill, options)

    window.addEventListener('beforeunload', () => {
      this.collaborativeEditor.destroy()
    })
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

  public destroy() {
    this.collaborativeEditor.destroy()
  }
}
