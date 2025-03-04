export default function ProgressBar(props: ProgressBarProps) {
  const normalizedProgress = Math.min(100, Math.max(0, props.progress * 100));
  return (
    <section className="block text-center">
      <label id="progress-label" htmlFor="progress">
        {props.message}
      </label>
      <div
        role="progressbar"
        aria-valuenow={normalizedProgress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-labelledby="progress-label"
        id="progress"
        className="w-full h-4 my-12 bg-[repeating-linear-gradient(-45deg,var(--color-neutral-100),var(--color-neutral-100)_10px,transparent_10px,transparent_20px)]"
      >
        <div
          className="h-full bg-neutral-800"
          style={{ width: `${normalizedProgress}%` }}
        />
        <span className="sr-only">{normalizedProgress}% complete</span>
      </div>
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
