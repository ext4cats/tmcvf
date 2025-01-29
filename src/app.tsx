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

    const ffmpeg = ffmpegRef.current;
    const output = await transcodeFile(ffmpeg, file);
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
      <button type="submit">Convert...</button>
    </form>
  );
}

async function transcodeFile(ffmpeg: FFmpeg, file: File) {
  const arrayBuf = await file.arrayBuffer();
  const inputBytes = new Uint8Array(arrayBuf);
  await ffmpeg.writeFile(file.name, inputBytes);
  await ffmpeg.exec(['-i', file.name, 'output.mkv']);
  const outputBytes = await ffmpeg.readFile('output.mkv');
  return new File([outputBytes], 'output.mkv', { type: 'video/x-matroska' });
}

function createFFmpeg() {
  const ffmpeg = new FFmpeg();
  ffmpeg.on('log', (event) => console.log(event.message));
  return ffmpeg;
}
