import esbuild from 'esbuild'
import { config } from "../config.js"
import { copyDir, deleteDir } from './fs.js';


const buildConfig = {
  ...config,
  outfile: "./build/assets/app.js",
  sourcemap: true,
  minify: true,
  treeShaking: true
}

export const copyAndBuild = async (config = {}) => {
  try {
    await deleteDir('./build')
    await copyDir('./public', './build')
    await build(config)
  } catch(e) {
    console.error(e)
    process.exit(1)
  }
}

export const build = async (config = {}) => {
  return esbuild.build({
    ...buildConfig,
    ...config
  })
}
