import { existsSync } from 'fs';
import { exec } from 'child_process'
import util from 'util';

const execAsync = util.promisify(exec)

export const deleteDir = async (path) => {
  if (existsSync(path)) {
    return execAsync(`rm -r "${path}"`)
  }
}

export const copyDir = async (path, pathTo) => {
  if (existsSync(path)) {
    return execAsync(`cp -r "${path}" "${pathTo}"`)
  }
}