import ConverterForm, {
  ConverterFormValues,
} from './components/converter-form';
import ProgressBar from './components/progress-bar';
import { useConverter } from './hooks/use-converter';

export default function App() {
  const converter = useConverter();
  return converter.state === 'idle' ? (
    <ConverterForm
      onSubmit={(values: ConverterFormValues) =>
        converter.convert(values.file, values.format, values.mode)
      }
    />
  ) : (
    <ProgressBar
      message={converter.message}
      progress={converter.progress}
      error={converter.error}
      onCancel={converter.cancel}
    />
  );
}
