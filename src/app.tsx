export default function App() {
  return (
    <div>
      <header>
        <h1>tmcvf</h1>
        <p>a tiny video converter powered by ffmpeg.wasm</p>
      </header>
      <main>
        <form>
          <fieldset>
            <legend>Select a processing mode:</legend>
            <label htmlFor="single-thread">Single-thread</label>
            <input
              type="radio"
              name="processing-mode"
              id="single-thread"
              value="single-thread"
              defaultChecked
            />
            <label htmlFor="multi-thread">Multi-thread</label>
            <input
              type="radio"
              name="processing-mode"
              id="multi-thread"
              value="multi-thread"
            />
          </fieldset>
          <fieldset>
            <legend>Choose what to convert:</legend>
            <label htmlFor="target-file">Target file:</label>
            <input type="file" name="target-file" id="target-file" />
            <label htmlFor="target-format">Target format:</label>
            <select name="target-format" id="target-format">
              <option value="mp4">mp4</option>
              <option value="webm">webm</option>
              <option value="avi">avi</option>
              <option value="mkv">mkv</option>
              <option value="mov">mov</option>
            </select>
          </fieldset>
          <button type="submit">Convert...</button>
        </form>
      </main>
      <footer>
        <p>
          warning: this video converter has no hardware acceleration, and as
          such is both slow and cpu intensive. please use either{' '}
          <a href="https://www.ffmpeg.org/download.html">native ffmpeg</a> or{' '}
          <a href="https://handbrake.fr/">handbrake</a> for heavier workloads.
        </p>
      </footer>
    </div>
  );
}
