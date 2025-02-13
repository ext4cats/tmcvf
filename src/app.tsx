import ConverterForm from './components/ConverterForm';
import ProgressBar from './components/ProgressBar';

export default function App() {
  return (
    <div>
      <header>
        <h1>tmcvf</h1>
        <p>a tiny video converter powered by ffmpeg.wasm</p>
      </header>
      <main>
        <ConverterForm
          onSubmit={(values) => window.alert(JSON.stringify(values, null, 2))}
        />
        <ProgressBar
          message="Working..."
          onCancel={() =>
            window.alert('You have been cancelled on twitter dot com')
          }
        />
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
