export function clearWhitespaces(text: string): string {
  if (!text) return text;

  let clearedText = text;

  while (clearedText.startsWith(' ') || clearedText.startsWith('\n')) {
    while (clearedText.startsWith(' ')) clearedText = clearedText.substring(1);
    while (clearedText.startsWith('\n')) clearedText = clearedText.substring(2);
  }

  while (clearedText.endsWith(' ') || clearedText.endsWith('\n')) {
    while (clearedText.endsWith(' ')) clearedText = clearedText.substring(0, clearedText.length - 1);
    while (clearedText.endsWith('\n')) clearedText = clearedText.substring(0, clearedText.length - 2);
  }

  return clearedText;
}
