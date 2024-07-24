import { defineConfig } from 'vite'
import { viscapism } from './src'
import dtsPlugin from 'vite-plugin-dts'

export default defineConfig((env) => {
  if (env.mode === 'production' && env.command === 'build') {
    return {
      plugins: [
        dtsPlugin({
          exclude: ['playground'],
        }),
      ],
      build: {
        ssr: true,
        outDir: 'lib',
        rollupOptions: {
          input: {
            index: './src/index.ts',
            'jsx/index': './src/jsx/index.ts',
          },
        },
      },
    }
  } else {
    return {
      plugins: [
        viscapism({
          srcFolderName: 'playground',
          assets: 'split',
        }),
      ],
    }
  }
})
