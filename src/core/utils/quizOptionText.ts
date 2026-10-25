const NAMED_ENTITIES: Record<string, string> = {
  lt: '<',
  gt: '>',
  amp: '&',
  quot: '"',
  apos: "'",
  nbsp: '\u00A0',
};

function isAsciiLetter(ch: string | undefined): boolean {
  if (!ch) return false;
  const code = ch.codePointAt(0) ?? 0;
  return (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
}

/** Decode common HTML entities without regex (Sonar S5852 / S2310). */
export function decodeHtmlEntities(text: string): string {
  let out = '';
  let remaining = text;
  while (remaining.length > 0) {
    const amp = remaining.indexOf('&');
    if (amp === -1) {
      out += remaining;
      break;
    }
    out += remaining.slice(0, amp);
    const fromAmp = remaining.slice(amp);
    const semi = fromAmp.indexOf(';');
    if (semi === -1 || semi > 10) {
      out += '&';
      remaining = remaining.slice(amp + 1);
      continue;
    }
    const body = fromAmp.slice(1, semi);
    if (body.startsWith('#')) {
      const hex = body.startsWith('#x') || body.startsWith('#X');
      const code = hex
        ? Number.parseInt(body.slice(2), 16)
        : Number.parseInt(body.slice(1), 10);
      if (Number.isFinite(code)) {
        out += String.fromCodePoint(code);
        remaining = remaining.slice(amp + semi + 1);
        continue;
      }
    } else if (body in NAMED_ENTITIES) {
      out += NAMED_ENTITIES[body];
      remaining = remaining.slice(amp + semi + 1);
      continue;
    }
    out += '&';
    remaining = remaining.slice(amp + 1);
  }
  return out;
}

/**
 * Strip HTML tags without regex backtracking (Sonar S5852 / S2310).
 * Only treats `<` as a tag start when followed by `/` or a letter,
 * so comparisons like `a < b` stay intact.
 */
export function stripHtmlTags(html: string): string {
  let out = '';
  let remaining = html;
  while (remaining.length > 0) {
    const ch = remaining[0];
    const next = remaining[1];
    if (ch === '<' && (next === '/' || isAsciiLetter(next))) {
      const gt = remaining.indexOf('>');
      remaining = gt === -1 ? '' : remaining.slice(gt + 1);
      out += ' ';
      continue;
    }
    out += ch;
    remaining = remaining.slice(1);
  }
  return out;
}

/** Option label with markup removed and entities decoded (plain-text UI). */
export function plainQuizOption(raw: string): string {
  return decodeHtmlEntities(stripHtmlTags(raw)).replace(/\s+/g, ' ').trim();
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
