import { copyBuildAndServe } from './index.js'

// copy public/ to serve/
// build ./index.ts to serve/assets/index.js
// serve serve/index.html
// your public/index.html must have <script src="assets/index.js"></script>

copyBuildAndServe({
  entryPoints: ["./index.ts"],
  outfile: "./serve/assets/index.js",
})