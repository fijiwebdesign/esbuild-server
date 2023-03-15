# esbuild-server

Use esbuild to serve and build files. Supports typescript, react, node

## Usage GIT

esbuild-server is not added to npm yet. So just use git for now.

### Create a public/ directory holding files to be copied to build/

*Example* 

```
mkdir public
echo '<script src="assets/app.js"></script>' > index.html
```

### Clone this git repo

```

git clone https://github.com/fijiwebdesign/esbuild-server

```

### Add entry file

The entry file defaults to `src/index.js`. Add some code to it. 

*Example:*

```
mkdir src/
echo "alert('hello!')" > src/index.js
```

## Serve your build

```
node esbuild-server/serve.js
```

Note: `esbuild-server/serve.js` and `esbuild-server/build.js` builds are relative to the `cwd` (directory it is called from. Not esbuild-server/ directory) . 

In this example `esbuild-server/serve.js` looks in the parent directory it is called from for the `/public` directory and `/src/index.js` entry file. 

## Build to `/build` directory

```
node esbuild-server/build.js
```

## Custom serve configuration

You can pass any build configs that esbuild accepts.

```
import { copyBuildAndServe } from './esbuild-server/index.js'

// copy public/ to serve/
// build ./index.ts to serve/assets/index.js
// serve serve/index.html
// your public/index.html must have <script src="assets/index.js"></script>

copyBuildAndServe({
  entryPoints: ["./index.ts"],
  outfile: "./serve/assets/index.js",
})
```

## Custom build configuration

You can pass any build configs that esbuild accepts.

```
import { copyAndBuild } from './esbuild-server/index.js'

// copy public/ to serve/
// build ./index.ts to ./build/assets/index.js
// your public/index.html must have <script src="assets/index.js"></script>

copyAndBuild({
  entryPoints: ["./index.ts"],
  outfile: "./build/assets/index.js",
})

```

