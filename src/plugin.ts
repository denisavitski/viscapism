import './types'
import 'global-jsdom/register'
import { Plugin, normalizePath } from 'vite'
import { join, resolve } from 'path'
import { existsSync, mkdirSync, readdir, rmSync, writeFileSync } from 'fs'
import { build } from 'esbuild'
import { readFile, rm, writeFile } from 'fs/promises'
import { ClientResource, StyleResource } from './resources'

const styleResource = new StyleResource()
const clientResource = new ClientResource()

const defaultIndexHTMLContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    __HEAD__
  </head>
  <body>
    __CONTENT__
  </body>
</html>
`

type Pages = { [key: string]: string }

interface ModuleRenderResult {
  html: string
  css: string
  js: string
}

export interface ViscapismOptions {
  assets?: 'split' | 'merge' | undefined
  distFolderName?: string
  srcFolderName?: string
}

class Viscapism {
  #plugin: Plugin
  #srcPath: string
  #pagesPath: string
  #indexHTMLPath: string
  #publicPath: string
  #devFolderPath: string
  #isBuildCommand = false
  #pages: Pages = {}
  #tmpBuildAssets = new Set<string>()
  #dependecies = new Map<string, Set<string>>()

  constructor(options?: ViscapismOptions) {
    this.#srcPath = normalizePath(resolve(process.cwd(), options?.srcFolderName || 'src'))
    this.#pagesPath = this.#joinPaths(this.#srcPath, 'pages')
    this.#indexHTMLPath = this.#joinPaths(this.#srcPath, 'index.html')
    this.#publicPath = this.#joinPaths(this.#srcPath, 'static')
    this.#devFolderPath = this.#joinPaths(this.#srcPath, '.dev')

    if (!existsSync(this.#indexHTMLPath)) {
      writeFileSync(this.#indexHTMLPath, defaultIndexHTMLContent)
    }

    readdir(this.#pagesPath, { recursive: true }, (_, files) => {
      files.forEach((f: any) => {
        if (typeof f === 'string') {
          if (f.includes('tsx')) {
            const name = f.replace(/jsx|tsx/, 'html')

            const path = this.#joinPaths(this.#srcPath, name)

            this.#pages[name] = path
          }
        }
      })
    })

    this.#plugin = {
      name: 'viscapism',

      config: (config, env) => {
        this.#isBuildCommand = env.command === 'build'

        if (env.mode === 'production' && env.command === 'serve') {
          return
        }

        config.root = this.#srcPath
        config.publicDir = this.#publicPath

        config.resolve = {
          ...config.resolve,
          alias: {
            ...config.resolve?.alias,
            '@components': this.#joinPaths(this.#srcPath, 'components'),
            '@utils': this.#joinPaths(this.#srcPath, 'utils'),
            '@pages': this.#joinPaths(this.#srcPath, 'pages'),
          },
        }

        config.esbuild = {
          ...config.esbuild,
          treeShaking: true,
        }

        config.server = {
          ...config.server,
          watch: {
            ...config.server?.watch,
            ignored: ['**/.dev/**'],
          },
        }

        config.build = {
          assetsInlineLimit: 0,
          emptyOutDir: true,
          modulePreload: false,
          ...config.build,
          rollupOptions: {
            ...config.build?.rollupOptions,
            input: {
              ...this.#pages,
            },
            output: {
              dir: resolve(process.cwd(), options?.distFolderName || 'dist'),
              chunkFileNames: () => {
                return 'assets/[name].js'
              },
              assetFileNames: () => {
                return 'assets/[name].[ext]'
              },
              entryFileNames: (e) => {
                return `assets/${e.name.replace('.html', '')}.js`
              },
              manualChunks: options?.assets
                ? (e) => {
                    if (options?.assets === 'split') {
                      const isJs = e.endsWith('js') || e.endsWith('ts')
                      const isCss = e.endsWith('css')

                      if (isJs || isCss) {
                        let res = e
                          .replace('.dev', 'pages')
                          .split(this.#srcPath)[1]
                          .split('.')
                          .slice(0, -1)
                          .join('.')
                          .slice(1)

                        if (res === 'index') {
                          res = 'layout'
                        }

                        if (isJs) {
                          res = `js/${res}`
                        } else if (isCss) {
                          res = `css/${res}`
                        }

                        return res
                      }
                    } else {
                      if (e.endsWith('ts') || e.endsWith('js')) {
                        return 'script'
                      } else if (e.endsWith('css')) {
                        return 'style'
                      }
                    }
                  }
                : undefined,
              ...config.build?.rollupOptions?.output,
            },
          },
        }
      },

      handleHotUpdate: (ctx) => {
        const found = Array.from(this.#dependecies).find(([_, context]) => {
          return context.has(ctx.file)
        })

        if (found) {
          ctx.server.hot.send({
            type: 'full-reload',
            path: '*',
          })
        }
      },

      buildStart: () => {
        mkdirSync(this.#devFolderPath, { recursive: true })

        if (this.#isBuildCommand) {
          for (const key in this.#pages) {
            const path = this.#pages[key]

            if (path !== this.#indexHTMLPath) {
              writeFileSync(path, '')
            }
          }
        }
      },

      buildEnd: () => {
        rmSync(this.#devFolderPath, { recursive: true, force: true })
      },

      closeBundle: () => {
        if (this.#isBuildCommand) {
          for (const key in this.#pages) {
            const path = this.#pages[key]

            if (path !== this.#indexHTMLPath) {
              rmSync(path, { force: true })
            }
          }

          this.#clearTmpBuildAssets()
        }
      },

      transformIndexHtml: {
        order: 'pre',
        handler: async (html, ctx) => {
          if (ctx.originalUrl) {
            const splitted = ctx.originalUrl.split('?')[0].split('.')

            if (splitted.length > 1) {
              const last = splitted[splitted.length - 1]

              if (last !== 'html') {
                return
              }
            }
          }

          let url = ''

          if (ctx.originalUrl) {
            url = ctx.originalUrl
          } else {
            url = ctx.path.split('.')[0].replace('index', '')
          }

          this.#dependecies.set(ctx.filename, new Set([this.#indexHTMLPath]))

          this.#clearTmpBuildAssets()

          const name = url.endsWith('/') ? url + 'index' : url

          const leaf = url.includes('/components/') ? name : `/pages${name}`

          const jsFilePath = this.#joinPaths(this.#devFolderPath, `${leaf}.js`)
          const entryPoint = this.#joinPaths(this.#srcPath, `${leaf}.tsx`)

          const renderResult = await this.#build({
            entryPoint,
            outfile: jsFilePath,
            context: ctx.filename,
          })

          const pageEl = document.createElement('html')
          pageEl.innerHTML = renderResult.html
          const pageHeadElement = pageEl.querySelector('head')
          const pageBodyElement = pageEl.querySelector('body')

          html = await readFile(this.#indexHTMLPath, 'utf-8')

          if (pageBodyElement) {
            html = html.replace('__CONTENT__', pageBodyElement?.innerHTML || '')
          }

          if (pageHeadElement) {
            html = html.replace('__HEAD__', pageHeadElement?.innerHTML || '')
          }

          html = await this.#insertResources(ctx.filename, {
            ...renderResult,
            html,
          })

          await rm(jsFilePath, { force: true })

          return html
        },
      },
    }
  }

  public get plugin() {
    return this.#plugin
  }

  async #insertResources(filename: string, renderResult: ModuleRenderResult) {
    const name = filename.split(this.#srcPath)[1].split('.')[0]

    let result = renderResult.html

    const now = this.#isBuildCommand ? '' : `.${Date.now()}`

    const cssPath = this.#joinPaths(this.#devFolderPath, `${name}${now}.css`)
    const jsPath = this.#joinPaths(this.#devFolderPath, `${name}${now}.js`)
    const cssHref = cssPath.split(this.#srcPath)[1]
    const jsHref = jsPath.split(this.#srcPath)[1]

    this.#tmpBuildAssets.add(cssPath)
    this.#tmpBuildAssets.add(jsPath)

    if (renderResult.css) {
      await writeFile(cssPath, renderResult.css)

      result = this.#appendResource(result, `<link rel="stylesheet" href="${cssHref}">`)
    }

    if (renderResult.js) {
      await writeFile(jsPath, renderResult.js)

      result = this.#appendResource(result, `<script type="module" src="${jsHref}"></script>`)
    }

    return result
  }

  #appendResource(html: string, value: string) {
    return html.replace(
      /<\/head>/i,
      `
        ${value}
      </head>`
    )
  }

  #joinPaths(...paths: string[]) {
    return normalizePath(join(...paths))
  }

  async #build(parameters: { entryPoint: string; outfile: string; context?: string }) {
    styleResource.clear()
    clientResource.clear()

    await build({
      entryPoints: [parameters.entryPoint],
      bundle: true,
      alias: { '@jsx': resolve(__dirname, 'jsx') },
      jsxFactory: 'h',
      jsxFragment: 'Fragment',
      inject: ['@jsx'],
      format: 'esm',
      outfile: parameters.outfile,
      plugins: [
        {
          name: '_',
          setup: (build) => {
            console.log('----')

            build.onLoad({ filter: /\.(tsx|jsx)/ }, async (args) => {
              if (parameters.context) {
                this.#dependecies.get(parameters.context)!.add(args.path)
              }

              const contents = await readFile(args.path, 'utf-8')

              return { contents: contents, loader: 'tsx' }
            })
          },
        },
      ],
    })

    const importPath = parameters.outfile + `?time=${Date.now()}`

    const importedModule = await import(importPath)

    let renderFunction: Function | null = importedModule.default

    if (!renderFunction) {
      for (const key in importedModule) {
        if (typeof importedModule[key] === 'function') {
          renderFunction = importedModule[key]
        }
      }
    }

    let html = ''
    if (renderFunction) {
      html = await renderFunction()
    }

    let js = ''
    if (clientResource.acc) {
      const file = await readFile(parameters.entryPoint, 'utf-8')

      const imports = this.#getAllImports(file)

      js = `${imports.join(';\n')}${imports.length ? ';\n\n' : ''}${clientResource.acc}`
    }

    const css = styleResource.acc

    const renderResult: ModuleRenderResult = {
      html,
      js,
      css,
    }

    return renderResult
  }

  #getAllImports(string: string) {
    let imports = Array.from(string.match(/import\s[\s\S]+?from\s+['"][^'"]+['"];?/g) || [])
    imports = imports.filter((imp) => !imp.includes('server'))

    return imports
  }

  #clearTmpBuildAssets() {
    this.#tmpBuildAssets.forEach((path) => {
      rmSync(path, { force: true })
    })

    this.#tmpBuildAssets.clear()
  }
}

export function viscapism(options?: ViscapismOptions) {
  return new Viscapism(options).plugin
}
