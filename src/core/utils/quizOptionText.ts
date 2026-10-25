/** Strip HTML tags without regex backtracking (Sonar S5852). */
export function stripHtmlTags(html: string): string {
  let out = '';
  let inTag = false;
  for (const ch of html) {
    if (ch === '<') {
      inTag = true;
    } else if (ch === '>') {
      inTag = false;
      out += ' ';
    } else if (!inTag) {
      out += ch;
    }
  }
  return out;
}

/** Option label with markup removed (no visual “correct answer” chips). */
export function plainQuizOption(raw: string): string {
  return stripHtmlTags(raw).replace(/\s+/g, ' ').trim();
}

/**
 * Plain labels padded to the same character length so “pick the longest”
 * is not a reliable cue. Uses NBSP + monospace rendering in the UI.
 */
export function displayQuizOptions(rawOptions: readonly string[]): string[] {
  const plains = rawOptions.map(plainQuizOption);
  const lengths = plains.map((p) => [...p].length);
  const maxLen = lengths.length > 0 ? Math.max(...lengths) : 0;
  return plains.map((p, i) => {
    const pad = maxLen - lengths[i];
    return pad > 0 ? p + '\u00A0'.repeat(pad) : p;
  });
}
