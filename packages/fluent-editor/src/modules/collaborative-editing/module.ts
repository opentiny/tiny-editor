import type FluentEditor from '../../fluent-editor'
import { CollaborativeEditor } from './collaborative-editing'

export class CollaborationModule {
  private collaborativeEditor: CollaborativeEditor

  constructor(public quill: FluentEditor, public options: any) {
    this.collaborativeEditor = new CollaborativeEditor(quill, options)
  }

  public getCursors() {
    return this.collaborativeEditor.getCursors()
  }

  public getAwareness() {
    return this.collaborativeEditor.getAwareness()
  }
}
