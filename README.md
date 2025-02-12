# This Machine Converts Video Formats

A tiny video converter powered by [ffmpeg.wasm](https://ffmpegwasm.netlify.app/), built as a proof of concept.

## Building

```bash
# install dependencies
pnpm install

# do a production build
pnpm build

# or run the development server
pnpm dev
```

## Performance

ffmpeg.wasm has no access to hardware acceleration, and as such, is slow. [Very slow.](https://ffmpegwasm.netlify.app/docs/performance#-ffmpeg--i-inputwebm-outputmp4) Even with multi-threading enabled.

I don't recommend using this for heavy workloads. For that, use [native FFmpeg](https://www.ffmpeg.org/) instead.

## Multi-threading support

Multi-threading is [currently broken](https://github.com/ffmpegwasm/ffmpeg.wasm/issues/597) on Chrome and Safari. Your mileage may vary when using multi-thread mode in any browser that isn't Firefox.

### Security requirements

The multi-threaded version of ffmpeg.wasm requires [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer#security_requirements). To make `SharedArrayBuffer` properly available to the underlying library, the following headers must be set in when serving the web page.

```http
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
```
