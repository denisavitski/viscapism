function objectToString(object: JSX.ClassObject) {
  let result = ''

  for (const className in object) {
    const isActive = object[className as keyof typeof object]

    if (isActive) {
      result += `${className} `
    }
  }

  return result
}

function arrayToString(array: JSX.ClassArray) {
  let result = ''

  array.filter(Boolean).forEach((v) => {
    if (v) {
      if (typeof v === 'string') {
        result += `${v} `
      } else if (typeof v === 'object') {
        result += objectToString(v)
      }
    }
  })

  return result
}

export function classToString(object: JSX.Class) {
  let result = ''

  if (typeof object === 'string') {
    result += object
  } else if (Array.isArray(object)) {
    result += arrayToString(object)
  } else if (typeof object === 'object') {
    result += objectToString(object)
  }

  while (result.endsWith(' ')) {
    result = result.slice(0, -1)
  }

  return result
}
