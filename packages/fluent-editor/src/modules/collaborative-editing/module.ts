import QuillCursors from 'quill-cursors'
import FluentEditor from '../../fluent-editor'
import { CollaborativeEditor } from './collaborative-editing'

export class CollaborationModule {
  private collaborativeEditor: CollaborativeEditor

  static register() {
    FluentEditor.register('modules/cursors', QuillCursors, true)
  }

  constructor(public quill: FluentEditor, public options: any) {
    this.collaborativeEditor = new CollaborativeEditor(quill, options)
  }

  public getCursors() {
    return this.collaborativeEditor.getCursors()
  }
}
