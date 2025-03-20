export type AnyFunction = (...args: any[]) => any
export type Constructor<T = any, U extends Array<any> = any[]> = new (...args: U) => T
