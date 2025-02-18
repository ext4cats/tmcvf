export default function ProgressBar(props: ProgressBarProps) {
  return (
    <section>
      <label htmlFor="progress">{props.message}</label>
      <progress id="progress" value={props.progress} />
      <button type="button" onClick={props.onCancel}>
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
