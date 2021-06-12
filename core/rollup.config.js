import alias from '@rollup/plugin-alias'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import svelte from 'rollup-plugin-svelte'
import autoPreprocess from 'svelte-preprocess'
import postcss from 'rollup-plugin-postcss'
import { terser } from 'rollup-plugin-terser'
// import { babel } from '@rollup/plugin-babel'

import path from 'path'

import pkg from './package.json'

const isProduction = !process.env.ROLLUP_WATCH

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: isProduction
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: isProduction
    }
  ],
  external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
  plugins: [
    alias({
      entries: [
        { find: '@', replacement: path.resolve(__dirname, 'src') },
        { find: '@tabs', replacement: path.resolve(__dirname, 'src/tabs') }
      ]
    }),
    commonjs(),
    typescript(),
    svelte({
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !isProduction
      },
      preprocess: autoPreprocess()
    }),
    postcss(),
    resolve({
      dedupe: ['svelte']
    }),
    // babel({
    //   babelHelpers: 'runtime',
    //   skipPreflightCheck: true,
    //   extensions: ['.js', '.mjs', '.html', '.svelte'],
    //   include: ['src/**', 'node_modules/svelte/**'],
    //   exclude: '**/node_modules/**',
    // }),
    isProduction && terser()
  ],
  watch: {
    clearScreen: false
  }
}
