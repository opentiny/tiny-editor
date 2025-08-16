import type { Persistence } from './index.js'
import { MongoClient } from 'mongodb'
import * as Y from 'yjs'
import { MONGODB_COLLECTION, MONGODB_DB, MONGODB_URL, YDOC_TEXT_KEY } from '../env.js'

export class MongoPersistence implements Persistence {
  private client: MongoClient
  private ready?: Promise<MongoClient>

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

    let saveTimeout: NodeJS.Timeout | undefined
    ydoc.on('update', () => {
      if (saveTimeout) clearTimeout(saveTimeout)
      saveTimeout = setTimeout(async () => {
        await this.saveData(docName, ydoc)
      }, 500)
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

  async close(): Promise<void> {
    await this.client.close()
  }
}
