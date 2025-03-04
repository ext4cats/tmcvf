import ConverterForm, {
  type ConverterFormValues,
} from './components/converter-form';
import ProgressBar from './components/progress-bar';
import { useConverter } from './hooks/use-converter';

export default function Converter() {
  const converter = useConverter();
  return converter.state === 'busy' ? (
    <ProgressBar
      message={converter.message}
      progress={converter.progress}
      error={converter.error}
      onCancel={converter.cancel}
    />
  ) : (
    <ConverterForm
      onSubmit={(values: ConverterFormValues) =>
        converter.convert(values.file, values.format, values.mode)
      }
    />
  );
}
