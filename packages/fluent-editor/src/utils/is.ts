export function isObject(value: unknown): value is Record<string, any> {
  const type = typeof value
  return value != null && (type === 'object' || type === 'function')
}
export const isUndefined = (val: unknown): val is undefined => val === undefined
export const isFunction = (val: unknown): val is Function => typeof val === 'function'
export const isString = (val: unknown): val is string => typeof val === 'string'
export const isBoolean = (val: unknown): val is boolean => typeof val === 'boolean'
export const isArray = Array.isArray
