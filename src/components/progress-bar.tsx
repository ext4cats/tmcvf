import './progress-bar.css';

export default function ProgressBar(props: ProgressBarProps) {
  return (
    <section className="block text-center">
      <label htmlFor="progress">{props.message}</label>
      <progress id="progress" value={props.progress} />
      {Boolean(props.error) && (
        <div
          role="alert"
          className="mb-8 p-2 text-sm bg-red-100 text-red-800 border-b border-dotted border-red-800"
        >
          <p>There was an error converting your file.</p>
          <pre className="mt-1">
            <code>{String(props.error)}</code>
          </pre>
        </div>
      )}
      <button
        className="px-16 border-b bg-neutral-50 py-1 border-dotted hover:border-solid hover:cursor-pointer"
        type="button"
        onClick={props.onCancel}
      >
        Cancel
      </button>
    </section>
  );
}

export interface ProgressBarProps {
  readonly message: string;
  readonly progress: number;
  readonly error?: unknown;
  readonly onCancel: () => void;
}
