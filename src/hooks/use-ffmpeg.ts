import { FFMessageLoadConfig, FFmpeg } from '@ffmpeg/ffmpeg';
import { useRef, useState } from 'react';

export type FFmpegState = 'unloaded' | 'loading' | 'idle' | 'working';
const coreCDN = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm';
const coreMtCDN =
  'https://cdn.jsdelivr.net/npm/@ffmpeg/core-mt@0.12.9/dist/esm';

export function useFFmpeg() {
  const [state, setState] = useState<FFmpegState>('unloaded');
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const coreRef = useRef<FFMessageLoadConfig | null>(null);
  const coreMtRef = useRef<FFMessageLoadConfig | null>(null);

  const load = async (mt: boolean) => {
    if (state === 'loading' || state === 'working') return;

    setState('loading');

    if (ffmpegRef.current === null) {
      const ffmpeg = new FFmpeg();
      ffmpeg.on('log', (event) => console.log(event.message));
      ffmpegRef.current = ffmpeg;
    }

    if (mt && coreRef.current === null) {
      const [coreURL, wasmURL] = await Promise.all([
        fetchBlob(`${coreCDN}/ffmpeg-core.js`),
        fetchBlob(`${coreCDN}/ffmpeg-core.wasm`),
      ]);
      coreRef.current = { coreURL, wasmURL };
    }

    if (!mt && coreMtRef.current === null) {
      const [coreURL, wasmURL, workerURL] = await Promise.all([
        fetchBlob(`${coreMtCDN}/ffmpeg-core.js`),
        fetchBlob(`${coreMtCDN}/ffmpeg-core.wasm`),
        fetchBlob(`${coreMtCDN}/ffmpeg-core.worker.js`),
      ]);
      coreMtRef.current = { coreURL, wasmURL, workerURL };
    }

    ffmpegRef.current.terminate();
    await ffmpegRef.current.load(mt ? coreMtRef.current! : coreRef.current!);

    setState('idle');
  };

  const transpile = async (file: File, format: TargetFormat) => {
    if (ffmpegRef.current === null || !ffmpegRef.current.loaded)
      throw new Error('ffmpeg is not loaded');
    const lastDot = file.name.lastIndexOf('.');
    const basename = lastDot !== -1 ? file.name.slice(0, lastDot) : file.name;
    const arrayBuf = await file.arrayBuffer();
    const inputBytes = new Uint8Array(arrayBuf);
    await ffmpegRef.current.writeFile(file.name, inputBytes);
    await ffmpegRef.current.exec(['-i', file.name, `${basename}.${format}`]);
    const outputBytes = await ffmpegRef.current.readFile(
      `${basename}.${format}`,
    );
    return new File([outputBytes], `${basename}.${format}`, {
      type: supportedTypes[format],
    });
  };

  return { state, load, transpile };
}

export type TargetFormat = keyof typeof supportedTypes;
const supportedTypes = {
  mkv: 'video/x-matroska',
  webm: 'video/webm',
  mp4: 'video/mp4',
} as const;

async function fetchBlob(url: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('failed to fetch blob');
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}
