export function isRecapComplete(
  selected: readonly string[],
  required: readonly string[],
): boolean {
  const checked = new Set(selected);
  return required.length > 0 && required.every((id) => checked.has(id));
}
