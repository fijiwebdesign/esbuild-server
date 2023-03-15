import inlineImage from "esbuild-plugin-inline-image"
import sassPlugin from 'esbuild-plugin-sass'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

export const config = {
  platform: 'browser',
  target: [
    'es6',
  ],
  //inject: ["./esbuild/inject/react-shim.js"],
  entryPoints: ["./src/index.js"],
  bundle: true,
  loader: {
    ".ts": "tsx",
    ".js": "tsx",
    ".ttf": "file",
    ".eot": "file",
    ".woff": "file",
    ".woff2": "file",
  },
  plugins: [
    NodeGlobalsPolyfillPlugin({
      process: true,
      buffer: true,
    }),
    NodeModulesPolyfillPlugin(),
    inlineImage(),
    sassPlugin(),
  ],
}