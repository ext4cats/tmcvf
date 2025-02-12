import { supportedTypes } from '../hooks/use-ffmpeg';

export default function ConvertForm() {
  return (
    <form>
      <label htmlFor="file">Input:</label>
      <input type="file" name="file" id="file" />
      <label htmlFor="format">Format:</label>
      <select name="format" id="format">
        {Object.keys(supportedTypes).map((format, idx) => (
          <option key={idx} value={format}>
            {format}
          </option>
        ))}
      </select>
      <button type="submit">Convert...</button>
    </form>
  );
}
