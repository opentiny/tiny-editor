export const HOST = process.env.HOST!
export const PORT = Number.parseInt(process.env.PORT!)

export const MONGODB_URL = process.env.MONGODB_URL!
export const MONGODB_DB = process.env.MONGODB_DB!
export const MONGODB_COLLECTION = process.env.MONGODB_COLLECTION!

export const YDOC_TEXT_KEY = process.env.YDOC_TEXT_KEY || 'tiny-editor'

export const GC_ENABLED = process.env.GC !== 'false' && process.env.GC !== '0'
