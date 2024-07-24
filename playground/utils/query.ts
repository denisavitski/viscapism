import { readFile } from 'fs/promises'

export function query(selector: string) {
  return document.querySelector(selector)
}

export async function read(path: string) {
  return readFile(path, 'utf-8')
}
