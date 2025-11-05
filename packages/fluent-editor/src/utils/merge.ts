/**
 * 深合并任意多个普通对象
 * @param {object} target  目标对象（会被修改）
 * @param {...object} sources 任意多个来源对象
 * @returns {object} 返回合并后的 target
 */
export function merge(target, ...sources) {
  if (!sources.length) return target

  const isObject = obj =>
    obj !== null && (typeof obj === 'object' || typeof obj === 'function')

  const isPlain = (obj) => {
    if (!isObject(obj)) return false
    const proto = Object.getPrototypeOf(obj)
    return proto === Object.prototype || proto === null
  }

  for (const src of sources) {
    if (!isObject(src)) continue

    for (const key in src) {
      if (!Object.prototype.hasOwnProperty.call(src, key)) continue

      const oldVal = target[key]
      const newVal = src[key]

      // 递归合并纯对象，否则直接覆盖
      if (isPlain(newVal) && (oldVal === undefined || isPlain(oldVal))) {
        target[key] = merge(oldVal || {}, newVal)
      }
      else {
        target[key] = newVal // 数组、函数、原始值等直接覆盖
      }
    }
  }
  return target
}
