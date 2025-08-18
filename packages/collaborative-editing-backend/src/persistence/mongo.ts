import type { Persistence } from './index.js'
import { MongoClient } from 'mongodb'
import * as Y from 'yjs'
import { MONGODB_COLLECTION, MONGODB_DB, MONGODB_URL, YDOC_TEXT_KEY } from '../env.js'

export class MongoPersistence implements Persistence {
  private client: MongoClient
  private ready?: Promise<MongoClient>
  private saveTimeouts = new WeakMap<Y.Doc, NodeJS.Timeout>()

  constructor() {
    if (!MONGODB_URL) throw new Error('缺少必需的环境变量: MONGODB_URL')
    if (!MONGODB_DB) throw new Error('缺少必需的环境变量: MONGODB_DB')
    if (!MONGODB_COLLECTION) throw new Error('缺少必需的环境变量: MONGODB_COLLECTION')

    this.client = new MongoClient(MONGODB_URL)
  }

  private async ensureReady() {
    if (!this.ready) {
      this.ready = this.client.connect()
    }
    await this.ready
  }

  private get db() {
    return this.client.db(MONGODB_DB)
  }

  async bindState(docName: string, ydoc: Y.Doc): Promise<void> {
    await this.ensureReady()
    const existing = await this.db.collection(MONGODB_COLLECTION).findOne<{ data?: number[] }>({ docName })
    if (existing?.data) {
      Y.applyUpdate(ydoc, new Uint8Array(existing.data))
    }

    ydoc.on('update', () => {
      const existingTimeout = this.saveTimeouts.get(ydoc)
      if (existingTimeout) clearTimeout(existingTimeout)
      const newTimeout = setTimeout(async () => {
        await this.saveData(docName, ydoc)
        this.saveTimeouts.delete(ydoc)
      }, 500)
      this.saveTimeouts.set(ydoc, newTimeout)
    })
  }

  async writeState(docName: string, ydoc: Y.Doc): Promise<void> {
    await this.ensureReady()
    await this.saveData(docName, ydoc)
  }

  private async saveData(docName: string, ydoc: Y.Doc) {
    const update = Y.encodeStateAsUpdate(ydoc)
    const text = ydoc.getText(YDOC_TEXT_KEY).toString()
    await this.db.collection(MONGODB_COLLECTION).replaceOne(
      { docName },
      { docName, data: Array.from(update), text },
      { upsert: true },
    )
  }

  public clearDocumentTimeout(ydoc: Y.Doc): void {
    const timeout = this.saveTimeouts.get(ydoc)
    if (timeout) {
      clearTimeout(timeout)
      this.saveTimeouts.delete(ydoc)
    }
  }

  async close(): Promise<void> {
    this.saveTimeouts = new WeakMap()
    await this.client.close()
  }
}
