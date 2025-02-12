import ConvertForm from './components/convert-form';
import ModeSelector from './components/mode-selector';

export default function App() {
  return (
    <div>
      <header>
        <h1>tmcvf</h1>
        <p>a tiny video converter powered by ffmpeg.wasm</p>
      </header>
      <main>
        <ModeSelector />
        <ConvertForm />
      </main>
      <footer>
        <p>warning: this video converter lacks hardware acceleration</p>
        <p>
          expect high CPU usage and slow processing times, especially in
          single-thread mode
        </p>
        <p>
          <a href="https://github.com/ext4cats/tmcvf">check me out on github</a>
        </p>
      </footer>
    </div>
  );
}
