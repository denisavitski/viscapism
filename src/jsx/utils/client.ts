const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor

export function clientToString<T extends { [key: string]: any }>(
  ...parameters: Parameters<typeof client<T>>
) {
  const args = typeof parameters[0] === 'function' ? null : parameters[0]
  const func = typeof parameters[0] === 'function' ? parameters[0] : parameters[1]

  const regex = /\{([\s\S]*)\}/
  const match = func.toString().match(regex)

  if (match) {
    const content = match[1].trim()

    if (content) {
      const newFuncConstructor = func instanceof AsyncFunction ? AsyncFunction : Function
      const newFuncArgs = JSON.stringify(args || {})

      return `(${new newFuncConstructor('server', content)})(${newFuncArgs});\n\n`
    }
  }

  return ''
}
