import { FFmpeg } from '@ffmpeg/ffmpeg';
import { FormEvent, useEffect, useRef, useState } from 'react';

type AppState = 'loading' | 'idle' | 'working';

export default function App() {
  const ffmpegRef = useRef(createFFmpeg());
  const [state, setState] = useState<AppState>('loading');
  useEffect(() => {
    const ffmpeg = ffmpegRef.current;
    const cdn = 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm';
    ffmpeg
      .load({
        coreURL: `${cdn}/ffmpeg-core.js`,
        wasmURL: `${cdn}/ffmpeg-core.wasm`,
        workerURL: '/ffmpeg-core.worker.js',
      })
      .then(() => setState('idle'));
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state === 'working') return;
    setState('working');
    const formData = new FormData(event.currentTarget);
    const file = formData.get('file');
    if (!(file instanceof File)) throw new Error('file is not a file');
    const format = formData.get('format');
    if (typeof format !== 'string') throw new Error('format must be a string');
    if (!isValidFormat(format))
      throw new Error(`unrecognized format: ${format}`);

    const ffmpeg = ffmpegRef.current;
    const output = await transcodeFile(ffmpeg, file, format);
    const url = URL.createObjectURL(output);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = output.name;
    anchor.click();
    URL.revokeObjectURL(url);
    setState('idle');
  };

  return (
    <div>
      <header>
        <h1>tmcvf</h1>
        <p>A tiny video converter powered by ffmpeg.wasm</p>
      </header>
      <main>
        {state === 'loading' ? (
          <div>
            <label htmlFor="loadingbar">Loading...</label>
            <progress id="loadingbar" />
          </div>
        ) : state === 'working' ? (
          <div>
            <label htmlFor="workingbar">Transcoding...</label>
            <progress id="workingbar" />
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            <label htmlFor="file">Input:</label>
            <input id="file" type="file" name="file" />
            <label htmlFor="format">Format:</label>
            <select id="format" name="format">
              {Object.keys(mimeTypes).map((value, idx) => (
                <option key={idx} value={value}>
                  {value}
                </option>
              ))}
            </select>
            <button type="submit">Convert...</button>
          </form>
        )}
        <footer>
          <p>
            warning: this converter lacks hardware acceleration, and as such, is
            very CPU intensive. for heavier workloads, please{' '}
            <a href="https://www.ffmpeg.org/">use ffmpeg directly</a>.
          </p>
        </footer>
      </main>
    </div>
  );
}

async function transcodeFile(ffmpeg: FFmpeg, file: File, format: VideoFormat) {
  const lastDot = file.name.lastIndexOf('.');
  const basename = lastDot !== -1 ? file.name.slice(0, lastDot) : file.name;
  const arrayBuf = await file.arrayBuffer();
  const inputBytes = new Uint8Array(arrayBuf);
  await ffmpeg.writeFile(file.name, inputBytes);
  await ffmpeg.exec(['-i', file.name, `${basename}.${format}`]);
  const outputBytes = await ffmpeg.readFile(`${basename}.${format}`);
  return new File([outputBytes], `${basename}.${format}`, {
    type: mimeTypes[format],
  });
}

type VideoFormat = keyof typeof mimeTypes;
const mimeTypes = {
  mkv: 'video/x-matroska',
  webm: 'video/webm',
  mp4: 'video/mp4',
} as const;

const isValidFormat = (format: string): format is VideoFormat =>
  format in mimeTypes;

function createFFmpeg() {
  const ffmpeg = new FFmpeg();
  ffmpeg.on('log', (event) => console.log(event.message));
  return ffmpeg;
}
