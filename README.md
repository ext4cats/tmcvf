# This Machine Converts Video Formats

Very basic online video converter using [ffmpeg.wasm](https://ffmpegwasm.netlify.app/).

## Building

First, download the web workers for ffmpeg.wasm from UNPKG. [Serving the worker locally is required for multi-threading to work.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer#security_requirements) Make sure you have cURL installed.

```bash
pnpm install-workers
```

Then install the package dependencies and build the site.

```bash
pnpm install

# Do a production build.
pnpm build

# ...or run the dev server.
pnpm dev
```
