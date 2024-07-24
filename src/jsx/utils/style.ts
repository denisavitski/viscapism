import { camelToKebab } from './string'

export function styleToString(object: JSX.Style) {
  let text = ''

  for (const key in object) {
    const value = (object as any)[key]

    if (typeof value === 'object') {
      text += `${key} {`
      text += styleToString(value)
      text += `}`
    } else {
      text += `${camelToKebab(key)}: ${value};`
    }
  }

  return text
}
