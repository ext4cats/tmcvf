import './progress-bar.css';

export default function ProgressBar(props: ProgressBarProps) {
  return (
    <section className="text-center">
      <label htmlFor="progress">{props.message}</label>
      <progress id="progress" value={props.progress?.toString()} />
      <button
        className="px-16 border-b border-neutral-600 border-dotted hover:border-solid hover:cursor-pointer"
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
  readonly progress?: number;
  readonly onCancel: () => void;
}
