import { FFMessageLoadConfig, FFmpeg } from '@ffmpeg/ffmpeg';
import { useRef, useState } from 'react';

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

    if (!mt && coreRef.current === null) {
      const [coreURL, wasmURL] = await Promise.all([
        fetchBlob(`${coreCDN}/ffmpeg-core.js`),
        fetchBlob(`${coreCDN}/ffmpeg-core.wasm`),
      ]);
      coreRef.current = { coreURL, wasmURL };
    }

    if (mt && coreMtRef.current === null) {
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
    const ffmpeg = ffmpegRef.current;
    if (ffmpeg === null || !ffmpeg.loaded)
      throw new Error('ffmpeg is not loaded');

    const arrayBuf = await file.arrayBuffer();
    const inputBytes = new Uint8Array(arrayBuf);
    await ffmpeg.writeFile(file.name, inputBytes);

    const lastDot = file.name.lastIndexOf('.');
    const basename = lastDot !== -1 ? file.name.slice(0, lastDot) : file.name;
    await ffmpeg.exec(['-i', file.name, `${basename}.${format}`]);

    const type = supportedTypes[format];
    const outputBytes = await ffmpeg.readFile(`${basename}.${format}`);
    return new File([outputBytes], `${basename}.${format}`, { type });
  };

  return { state, load, transpile };
}

async function fetchBlob(url: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('failed to fetch blob');
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

export type FFmpegState = 'unloaded' | 'loading' | 'idle' | 'working';
const coreCDN = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm';
const coreMtCDN =
  'https://cdn.jsdelivr.net/npm/@ffmpeg/core-mt@0.12.9/dist/esm';

export type TargetFormat = keyof typeof supportedTypes;
export const supportedTypes = {
  mkv: 'video/x-matroska',
  webm: 'video/webm',
  mp4: 'video/mp4',
} as const;
