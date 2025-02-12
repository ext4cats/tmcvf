import { supportedTypes } from './hooks/use-ffmpeg';

export default function App() {
  return (
    <div>
      <header>
        <h1>tmcvf</h1>
        <p>a tiny video converter powered by ffmpeg.wasm</p>
      </header>
      <main>
        <fieldset>
          <legend>Select a mode:</legend>
          <label htmlFor="single-thread">Single-thread</label>
          <input type="radio" id="single-thread" />
          <label htmlFor="multi-thread">Multi-thread</label>
          <input type="radio" id="multi-thread" />
        </fieldset>
        <form>
          <label htmlFor="file">Input:</label>
          <input type="file" name="file" id="file" />
          <label htmlFor="format">Format:</label>
          <select name="format" id="format">
            {Object.keys(supportedTypes).map((format, idx) => (
              <option key={idx} value={format}>
                {format}
              </option>
            ))}
          </select>
          <button type="submit">Convert...</button>
        </form>
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
