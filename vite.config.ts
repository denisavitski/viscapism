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
        ssr: 'src/index.ts',
        outDir: 'lib',
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
