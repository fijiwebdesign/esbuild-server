import esbuild from 'esbuild'
import { config } from "./config.js"
import { getSafeEnv } from './lib/env.js';
import { copyDir, deleteDir } from './lib/fs.js';

// only include env vars prefixed REACT_ or NODE_
const safeEnv = getSafeEnv()

const buildConfig = {
  ...config,
  outfile: "./build/assets/app.js",
  sourcemap: true,
  minify: true,
  treeShaking: true,
  define: {
    process: JSON.stringify({
      version: process.version,
      env: safeEnv
    })
  },
}

const build = async () => {
  try {
    await deleteDir('./build')
    await copyDir('./public', './build')
    await esbuild.build(buildConfig)
  } catch(e) {
    console.error(e)
    process.exit(1)
  }
}

build()