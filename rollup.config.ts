import { RollupOptions } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'

const config: RollupOptions[] = [
  {
    input: './src/index.ts',
    output: [{ dir: 'dist', format: 'esm' }],
    plugins: [dts()]
  },
  {
    input: './src/index.ts',
    output: [
      {
        dir: 'dist',
        format: 'esm',
        entryFileNames: '[name].esm.js'
      },
      {
        dir: 'dist',
        format: 'cjs',
        entryFileNames: '[name].js'
      }
    ],
    plugins: [typescript()]
  }
]

export default config
