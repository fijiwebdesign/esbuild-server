import * as esbuild from "esbuild";
import { createServer, request } from "http";
import process from "process";
import { config as defaultConfig } from "../config.js";
import { copyDir, deleteDir } from "./fs.js";

// https://github.com/evanw/esbuild/issues/802
// https://www.npmjs.com/package/esbuild-serve
const clients = [];

export const copyBuildAndServe = async (config = {}) => {
  try {
    await deleteDir('./serve')
    await copyDir('./public', './serve')
    console.log('building...')
    await buildToServeDirectory(config)
    console.log('serving...')
    await createDevServer(config)
  } catch(e) {
    console.error(e)
    process.exit(1)
  }
  
}

export const buildToServeDirectory = async (config) => esbuild
  .build({
    ...defaultConfig,
    outfile: "./serve/assets/app.js",
    sourcemap: true,
    ...config,
    watch: {
      onRebuild(error, result) {
        clients.forEach((res) => res.write("data: update\n\n"));
        clients.length = 0;
        console.log(error ? error : "⚡ rebuilt...");
      },
    },
  })

export const createDevServer = async (config = {}) => {
  await esbuild.serve({ servedir: "./serve" }, {})

  const port = config?.port || 3000
  const esbuildPort = config?.esbuildPort || 8000

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
        { hostname: "0.0.0.0", port: esbuildPort, path, method, headers },
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
  }).listen(port, () => {
    console.log('⛵ Server at http://localhost:' + port)
  });

}
