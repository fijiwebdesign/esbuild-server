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

node esbuild-server/serve.js

```

The entry file is `src/index.js`. Add some code to it. 

*Example:*

```

echo "alert('hello!')" > src/index.js

```

For now you can edit the `esbuild-server/config.js` to modify the entry file, target or any other esbuild configs. 

