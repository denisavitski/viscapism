import { clientToString } from './jsx/utils/client'
import { styleToString } from './jsx/utils/style'

abstract class Resource {
  #cache = new Set<string>()
  #acc = ''

  public get acc() {
    return this.#acc
  }

  public add(value: string) {
    if (!this.#cache.has(value)) {
      this.#cache.add(value)
      this.#acc += value
    }
  }

  public clear() {
    this.#acc = ''
    this.#cache.clear()
  }
}

export class StyleResource extends Resource {
  constructor() {
    super()

    globalThis.style = (...args) => {
      const string = styleToString(...args)
      this.add(string)
    }
  }
}

export class ClientResource extends Resource {
  constructor() {
    super()

    globalThis.client = (...args: Array<any>) => {
      const string = clientToString(...(args as Parameters<typeof client>))
      this.add(string)
    }
  }
}
