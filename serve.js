import * as esbuild from "esbuild";
import { createServer, request } from "http";
import process from "process";
import { config } from "./config.js";
import { getSafeEnv } from "./lib/env.js";
import { copyDir, deleteDir } from "./lib/fs.js";

// https://github.com/evanw/esbuild/issues/802
// https://www.npmjs.com/package/esbuild-serve
const clients = [];

// only include env vars prefixed REACT_ or NODE_
const safeEnv = getSafeEnv()

const run = async () => {
  try {
    await deleteDir('./serve')
    await copyDir('./public', './serve')
    console.log('building...')
    await build()
    console.log('serving...')
    await serve()
  } catch(e) {
    console.error(e)
    process.exit(1)
  }
  
}

const build = async () => esbuild
  .build({
    ...config,
    outfile: "./serve/assets/app.js",
    sourcemap: true,
    define: {
      process: JSON.stringify({
        version: process.version,
        env: safeEnv
      })
    },
    watch: {
      onRebuild(error, result) {
        clients.forEach((res) => res.write("data: update\n\n"));
        clients.length = 0;
        console.log(error ? error : "⚡ rebuilt...");
      },
    },
  })

const serve = async () => esbuild.serve({ servedir: "./serve" }, {}).then(() => {
  createServer((req, res) => {
    const { url, method, headers } = req;
    if (req.url === "/esbuild")
      return clients.push(
        res.writeHead(200, {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        })
      );
    const path = new URL(url, 'http://localhost').pathname.split('/').pop().includes('.')
      ? url : `/index.html`; //for PWA with router
    req.pipe(
      request(
        { hostname: "0.0.0.0", port: 8000, path, method, headers },
        (prxRes) => {
          let jsReloadCode = ''
          if (url === "/assets/app.js") {

            jsReloadCode =
              `;new EventSource("/esbuild").onmessage = () => location.reload();`;

            const newHeaders = {
              ...prxRes.headers,
              "content-length":
                parseInt(prxRes.headers["content-length"], 10) +
                jsReloadCode.length,
            };

            res.writeHead(prxRes.statusCode, newHeaders);
          } else {
            res.writeHead(prxRes.statusCode, prxRes.headers);
          }
          prxRes.pipe(res, { end: true });
          res.write(jsReloadCode)
        }
      ),
      { end: true }
    );
  }).listen(3000, () => {
    console.log('⛵ Server at http://localhost:3000')
  });
});

run()