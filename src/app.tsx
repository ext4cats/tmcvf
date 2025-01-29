import { FFmpeg } from '@ffmpeg/ffmpeg';
import { FormEvent, useEffect, useRef, useState } from 'react';

type AppState = 'loading' | 'idle';

export default function App() {
  const ffmpegRef = useRef(new FFmpeg());
  const [state, setState] = useState<AppState>('loading');
  useEffect(() => {
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on('log', (event) => console.log(event.message));
    ffmpeg.load().then(() => setState('idle'));
  }, []);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const file = formData.get('file');
    if (!(file instanceof File)) throw new Error('file is not a file');

    const url = URL.createObjectURL(file);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = file.name;
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
