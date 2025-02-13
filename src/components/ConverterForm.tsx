import { FormEvent } from 'react';

export default function ConverterForm(props: ConverterFormProps) {
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const mode = formData.get('processing-mode');
    const format = formData.get('target-format');
    const file = formData.get('target-file');

    if (typeof mode !== 'string')
      throw new Error(`processing-mode: expected string, got ${typeof mode}`);
    if (!isProcessingMode(mode))
      throw new Error(`processing-mode: invalid value: ${mode}`);
    if (typeof format !== 'string')
      throw new Error(`target-format: expected string, got ${format}`);
    if (!isSupportedFormat(format))
      throw new Error(`target-format: invalid value: ${format}`);
    if (!(file instanceof File))
      throw new Error(`target-file: expected File, got ${typeof file}`);

    props.onSubmit({ mode, format, file });
  };

  return (
    <form onSubmit={onSubmit}>
      <fieldset>
        <legend>Select a processing mode:</legend>
        <label htmlFor="single-thread">Single-thread</label>
        <input
          required
          type="radio"
          name="processing-mode"
          id="single-thread"
          value="single-thread"
          defaultChecked
        />
        <label htmlFor="multi-thread">Multi-thread</label>
        <input
          required
          type="radio"
          name="processing-mode"
          id="multi-thread"
          value="multi-thread"
        />
      </fieldset>
      <fieldset>
        <legend>Choose what to convert:</legend>
        <label htmlFor="target-file">Target file:</label>
        <input required type="file" name="target-file" id="target-file" />
        <label htmlFor="target-format">Target format:</label>
        <select required name="target-format" id="target-format">
          <option value="mp4">mp4</option>
          <option value="webm">webm</option>
          <option value="avi">avi</option>
          <option value="mkv">mkv</option>
          <option value="mov">mov</option>
        </select>
      </fieldset>
      <button type="submit">Convert...</button>
    </form>
  );
}

export interface ConverterFormProps {
  readonly onSubmit: (values: ConverterFormValues) => void;
}

export interface ConverterFormValues {
  readonly mode: ProcessingMode;
  readonly format: SupportedFormat;
  readonly file: File;
}

const supportedFormats = ['mp4', 'webm', 'avi', 'mkv', 'mov'] as const;
const processingModes = ['single-thread', 'multi-thread'] as const;
export type SupportedFormat = (typeof supportedFormats)[number];
export type ProcessingMode = (typeof processingModes)[number];

const isSupportedFormat = (x: string): x is SupportedFormat =>
  supportedFormats.includes(x as SupportedFormat);
const isProcessingMode = (x: string): x is ProcessingMode =>
  processingModes.includes(x as ProcessingMode);
