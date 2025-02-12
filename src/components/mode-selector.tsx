export default function ModeSelector() {
  return (
    <fieldset>
      <legend>Select a mode:</legend>
      <label htmlFor="single-thread">Single-thread</label>
      <input type="radio" id="single-thread" />
      <label htmlFor="multi-thread">Multi-thread</label>
      <input type="radio" id="multi-thread" />
    </fieldset>
  );
}
