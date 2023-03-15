import { getSafeEnv } from "../lib/env"

// use this if you need nextTick
// or just define nextTick at the top of your app
const processShim = {
  version: process.version,
  env: getSafeEnv(),
  nextTick: (cb) => queueMicrotask(cb)
}

export {
  processShim as process
}