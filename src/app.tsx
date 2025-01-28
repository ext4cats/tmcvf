import { FormEvent } from 'react';

export default function App() {
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const file = formData.get('file');
    if (!(file instanceof File)) throw new Error('file is not a file');

    const url = URL.createObjectURL(file);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = file.name;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="file">Input:</label>
      <input id="file" type="file" name="file" />
      <button type="submit">Convert...</button>
    </form>
  );
}
