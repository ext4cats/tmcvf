import { type FFMessageLoadConfig, FFmpeg } from '@ffmpeg/ffmpeg';
import { useRef, useState } from 'react';
import type {
  ProcessingMode,
  SupportedFormat,
} from '../components/converter-form';

export function useConverter() {
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const stConfigRef = useRef<FFMessageLoadConfig | null>(null);
  const mtConfigRef = useRef<FFMessageLoadConfig | null>(null);
  const [state, setState] = useState<'idle' | 'busy'>('idle');
  const [error, setError] = useState<unknown>(null);
  const [message, setMessage] = useState('');
  const [progress, setProgress] = useState(0);

  const innerConvert = async (
    file: File,
    format: SupportedFormat,
    mode: ProcessingMode,
  ) => {
    setMessage('Loading libraries...');
    setProgress(0);
    setError(null);
    setState('busy');

    if (ffmpegRef.current === null) {
      const ffmpeg = new FFmpeg();
      ffmpeg.on('log', (event) => console.log(event.message));
      ffmpeg.on('progress', (event) => setProgress(event.progress));
      ffmpegRef.current = ffmpeg;
    }

    const ffmpeg = ffmpegRef.current;

    if (mode === 'single-thread') {
      if (stConfigRef.current === null)
        stConfigRef.current = await fetchStConfig();
      await ffmpeg.load(stConfigRef.current);
    }

    if (mode === 'multi-thread') {
      if (mtConfigRef.current === null)
        mtConfigRef.current = await fetchMtConfig();
      await ffmpeg.load(mtConfigRef.current);
    }

    setMessage('Converting...');

    const arrayBuf = await file.arrayBuffer();
    const inputBytes = new Uint8Array(arrayBuf);
    await ffmpeg.writeFile(file.name, inputBytes);

    const lastDot = file.name.lastIndexOf('.');
    const basename = lastDot !== -1 ? file.name.slice(0, lastDot) : file.name;

    const baseOptions = ['-i', file.name];
    if (format === 'webm')
      baseOptions.push('-c:v', 'libvpx', '-c:a', 'libvorbis');
    await ffmpeg.exec([...baseOptions, `${basename}.${format}`]);

    const outputBytes = await ffmpeg.readFile(`${basename}.${format}`);
    const outputFile = new File([outputBytes], `${basename}.${format}`, {
      type: mimeTypes[format],
    });

    setMessage('Starting download...');

    const downloadUrl = URL.createObjectURL(outputFile);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = downloadUrl;
    downloadAnchor.download = outputFile.name;
    downloadAnchor.click();
    URL.revokeObjectURL(downloadUrl);

    setMessage('Cleaning up...');

    ffmpeg.terminate();

    setState('idle');
  };

  const convert = async (
    file: File,
    format: SupportedFormat,
    mode: ProcessingMode,
  ) => {
    try {
      await innerConvert(file, format, mode);
    } catch (err) {
      if (err instanceof Error && err.message === 'called FFmpeg.terminate()')
        return;
      setError(err);
      console.error(err);
    }
  };

  const cancel = () => {
    ffmpegRef.current?.terminate();
    setState('idle');
  };

  return state === 'idle'
    ? { state, convert }
    : { state, message, progress, error, cancel };
}

const cdnSt = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm';
const cdnMt = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core-mt@0.12.9/dist/esm';

async function fetchStConfig(): Promise<FFMessageLoadConfig> {
  return {
    coreURL: await fetchBlob(`${cdnSt}/ffmpeg-core.js`),
    wasmURL: await fetchBlob(`${cdnSt}/ffmpeg-core.wasm`),
  };
}

async function fetchMtConfig(): Promise<FFMessageLoadConfig> {
  return {
    coreURL: await fetchBlob(`${cdnMt}/ffmpeg-core.js`),
    wasmURL: await fetchBlob(`${cdnMt}/ffmpeg-core.wasm`),
    workerURL: await fetchBlob(`${cdnMt}/ffmpeg-core.worker.js`),
  };
}

async function fetchBlob(url: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('got non-ok response fetching blob');
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

const mimeTypes = {
  mkv: 'video/x-matroska',
  webm: 'video/webm',
  mp4: 'video/mp4',
  mov: 'video/quicktime',
  avi: 'video/x-msvideo',
} as const;
