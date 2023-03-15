import { copyAndBuild } from './index.js'

// copy public/ to serve/
// build ./index.ts to ./build/assets/index.js
// your public/index.html must have <script src="assets/index.js"></script>

copyAndBuild({
  entryPoints: ["./index.ts"],
  outfile: "./build/assets/index.js",
})