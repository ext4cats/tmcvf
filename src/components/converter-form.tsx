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
      <fieldset className="my-8">
        <legend className="text-neutral-600 mb-4">
          Select a processing mode
        </legend>
        <div className="flex gap-8 justify-center">
          <label
            className="flex gap-2 hover:cursor-pointer"
            htmlFor="single-thread"
          >
            <input
              required
              className="hover:cursor-pointer"
              type="radio"
              name="processing-mode"
              id="single-thread"
              value="single-thread"
              defaultChecked
            />
            Single-thread
          </label>
          <label
            className="flex gap-2 hover:cursor-pointer"
            htmlFor="multi-thread"
          >
            <input
              required
              className="hover:cursor-pointer"
              type="radio"
              name="processing-mode"
              id="multi-thread"
              value="multi-thread"
            />
            Multi-thread
          </label>
        </div>
      </fieldset>
      <fieldset className="my-8">
        <legend className="text-neutral-600 mb-4">
          Choose what to convert
        </legend>
        <div className="grid items-end grid-cols-[max-content_auto] gap-4">
          <label
            className="justify-self-end text-neutral-600 hover:cursor-pointer text-sm"
            htmlFor="target-file"
          >
            Target file
          </label>
          <input
            required
            className="border-b border-neutral-600 border-dotted hover:border-solid hover:cursor-pointer file:hidden"
            type="file"
            name="target-file"
            id="target-file"
          />
          <label
            className="justify-self-end text-neutral-600 hover:cursor-pointer text-sm"
            htmlFor="target-format"
          >
            Target format
          </label>
          <select
            required
            className="border-b border-neutral-600 border-dotted hover:border-solid hover:cursor-pointer"
            name="target-format"
            id="target-format"
          >
            <option value="mp4">mp4</option>
            <option value="webm">webm</option>
            <option value="avi">avi</option>
            <option value="mkv">mkv</option>
            <option value="mov">mov</option>
          </select>
        </div>
      </fieldset>
      <button
        className="px-16 border-b border-neutral-600 border-dotted hover:border-solid hover:cursor-pointer"
        type="submit"
      >
        Convert...
      </button>
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
