import { FFmpeg } from '@ffmpeg/ffmpeg';
import { FormEvent, useEffect, useRef, useState } from 'react';

type AppState = 'loading' | 'idle';

export default function App() {
  const ffmpegRef = useRef(createFFmpeg());
  const [state, setState] = useState<AppState>('loading');
  useEffect(() => {
    const ffmpeg = ffmpegRef.current;
    ffmpeg.load().then(() => setState('idle'));
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
  };

  return state === 'loading' ? (
    <p>Loading...</p>
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
