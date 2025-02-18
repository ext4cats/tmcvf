import './app.css';
import ProgressBar from './components/progress-bar';

export default function App() {
  return (
    <div className="max-w-xl mx-auto px-4 text-center">
      <header className="mt-24">
        <h1 className="text-4xl mb-2">tmcvf</h1>
        <p className="text-neutral-600">
          a tiny video converter powered by ffmpeg.wasm
        </p>
      </header>
      <main className="my-16">
        <ProgressBar
          message="Working..."
          onCancel={() => window.alert('cancelled on twitter')}
          progress={0}
        />
      </main>
      <footer>
        <p className="text-sm text-neutral-600">
          warning: this video converter has no hardware acceleration, and as
          such is both slow and cpu intensive. please use either{' '}
          <a
            className="text-indigo-700 hover:underline"
            href="https://www.ffmpeg.org/download.html"
            target="_blank"
            rel="noreferrer"
          >
            native ffmpeg
          </a>{' '}
          or{' '}
          <a
            className="text-indigo-700 hover:underline"
            href="https://handbrake.fr/"
            target="_blank"
            rel="noreferrer"
          >
            handbrake
          </a>{' '}
          for heavier workloads.
        </p>
      </footer>
    </div>
  );
}
