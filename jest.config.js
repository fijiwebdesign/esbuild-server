import { config } from "./config.test.js"
import * as url from 'url';
import hq from 'alias-hq'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const jestConfig = {
  "rootDir": "../",
  "roots": ["./src"],
  "moduleNameMapper": hq.get('jest', { format: 'array' }),
  "collectCoverageFrom": [
    "./**/*.js",
    "./**/*.jsx"
  ],
  "transform": {
    "^.+\\.[jt]sx?$": [ 
      "jest-esbuild", 
      { 
        ...config,
      } 
    ]
  },
  "moduleDirectories": [
    "node_modules",
    __dirname // bug cannot use ./
  ],
  "testEnvironment": "jsdom",
  "testEnvironmentOptions": {
    "url": "http://localhost"
  }
}

export default jestConfig