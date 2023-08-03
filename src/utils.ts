export function clearWhitespaces(text: string): string {
  let clearedText = text;

  while (clearedText.startsWith(' ') || clearedText.startsWith('\n')) {
    if (clearedText.startsWith(' ')) {
      clearedText = clearedText.replace(' ', '');
    }

    if (clearedText.startsWith('\n')) {
      clearedText = clearedText.replace('\n', '');
    }
  }

  while (clearedText.endsWith(' ') || clearedText.endsWith('\n')) {
    if (clearedText.endsWith(' ')) {
      clearedText = clearedText.substring(0, clearedText.length - 1);
    }

    if (clearedText.endsWith('\n')) {
      clearedText = clearedText.substring(0, clearedText.length - 2);
    }
  }

  return clearedText;
}
