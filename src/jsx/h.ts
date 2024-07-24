/**
 * Based on https://github.com/developit/vhtml
 */

import { styleToString } from './utils/style'
import { classToString } from './utils/class'

export const emptyTags = [
  'area',
  'base',
  'br',
  'col',
  'command',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]

const esc = (str: string): string => String(str).replace(/[&<>"']/g, (s) => `&${map[s]};`)

const map: { [key: string]: string } = {
  '&': 'amp',
  '<': 'lt',
  '>': 'gt',
  '"': 'quot',
  "'": 'apos',
}

const setInnerHTMLAttr = 'dangerouslySetInnerHTML'

const sanitized: { [key: string]: boolean } = {}

export async function h(
  tag: string | ((attrs: any) => any),
  attrs?: { [key: string]: any },
  ...children: any[]
): Promise<string> {
  children = children.flat()

  let stack: any[] = []
  let s: string = ''

  attrs = attrs || {}

  stack.push(...children.reverse())

  if (typeof tag === 'function') {
    attrs.children = await Promise.all(stack.reverse())

    const res = await tag(attrs)

    return res
  }

  if (tag) {
    s += '<' + tag

    for (let attr in attrs) {
      if (attrs[attr] !== false && attrs[attr] != null && attr !== setInnerHTMLAttr) {
        let value: any = null!

        if (attr === 'style') {
          value = styleToString(attrs[attr])
        } else if (attr === 'class') {
          value = classToString(attrs[attr])
        } else {
          value = attrs[attr]
        }

        s += ` ${esc(attr)}="${esc(value)}"`
      }
    }
    s += '>'
  }

  if (emptyTags.indexOf(tag) === -1) {
    if (attrs[setInnerHTMLAttr]) {
      s += attrs[setInnerHTMLAttr].__html
    } else {
      while (stack.length) {
        let child = stack.pop()
        if (child) {
          if (Array.isArray(child)) {
            stack.push(...child.reverse())
          } else if (typeof child === 'string' || typeof child === 'number') {
            s += sanitized[child] === true ? child : esc(String(child))
          } else if (typeof child === 'object' && 'then' in child) {
            let awaitedChild = await child
            s += sanitized[awaitedChild] === true ? awaitedChild : esc(String(awaitedChild))
          } else {
            s += sanitized[child] === true ? child : esc(String(child))
          }
        }
      }
    }

    s += tag ? `</${tag}>` : ''
  }

  sanitized[s] = true

  return s
}

export function Fragment(attr: { children: any[] }) {
  let result = ''

  attr.children.forEach((child) => {
    result += child
  })

  return result
}
