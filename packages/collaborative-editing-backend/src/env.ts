export const HOST = process.env.HOST!
export const PORT = Number.parseInt(process.env.PORT!)

export const MONGODB_URL = process.env.MONGODB_URL! as string
export const MONGODB_DB = process.env.MONGODB_DB! as string
export const MONGODB_COLLECTION = process.env.MONGODB_COLLECTION! as string

export const GC_ENABLED = (process.env.GC !== 'false' && process.env.GC !== '0') as boolean
