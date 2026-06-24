const TOKEN_RE = new RegExp(
  [
    String.raw`\/\/[^\n]*`,
    String.raw`\/\*[\s\S]*?\*\/`,
    String.raw`` + '`' + String.raw`(?:\\[\s\S]|[^` + '`' + String.raw`\\])*` + '`',
    String.raw`'(?:\\.|[^'\\])*'`,
    String.raw`"(?:\\.|[^"\\])*"`,
    String.raw`\b\d+(?:\.\d+)?\b`,
    String.raw`\b(?:const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|class|interface|type|extends|implements|new|import|export|from|async|await|try|catch|finally|throw|public|private|protected|readonly|static|get|set|constructor|super|this|typeof|keyof|in|of|as|is|infer|namespace|enum|abstract|declare|default|test|expect|describe|beforeEach|afterEach|beforeAll|afterAll)\b`,
    String.raw`\b(?:string|number|boolean|void|any|unknown|never|object|bigint|symbol|undefined|null|true|false|page|locator|browser|context)\b`,
    String.raw`\b[A-Z][A-Za-z0-9_]*(?=[<\[\]\s,;:=){])`,
    String.raw`\b[A-Za-z_$][\w$]*(?=\s*\()`,
    String.raw`\b[A-Za-z_$][\w$]*\b`,
  ].join('|'),
  'g',
);

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

const KEYWORDS = new Set([
  'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do',
  'switch', 'case', 'break', 'continue', 'class', 'interface', 'type', 'extends',
  'implements', 'new', 'import', 'export', 'from', 'async', 'await', 'try', 'catch',
  'finally', 'throw', 'public', 'private', 'protected', 'readonly', 'static', 'get',
  'set', 'constructor', 'super', 'this', 'typeof', 'keyof', 'in', 'of', 'as', 'is',
  'infer', 'namespace', 'enum', 'abstract', 'declare', 'default',
  // Playwright-specific keywords
  'test', 'expect', 'describe', 'beforeEach', 'afterEach', 'beforeAll', 'afterAll',
]);

const classForToken = (token: string, source: string, offset: number) => {
  if (token.startsWith('//') || token.startsWith('/*')) return 'tok-comment';
  if (token.startsWith('"') || token.startsWith("'") || token.startsWith('`')) return 'tok-string';
  if (/^\d/.test(token)) return 'tok-number';
  if (/^(true|false|null|undefined)$/.test(token)) return 'tok-constant';
  if (KEYWORDS.has(token)) return 'tok-keyword';
  if (/^(string|number|boolean|void|any|unknown|never|object|bigint|symbol|page|locator|browser|context)$/.test(token)) return 'tok-type';
  if (/^[A-Z]/.test(token)) return 'tok-type';
  if (/^[A-Za-z_$][\w$]*$/.test(token) && /^\s*\(/.test(source.slice(offset + token.length))) {
    return 'tok-function';
  }
  return 'tok-variable';
};

export const highlightText = (value: string) => {
  let html = '';
  let lastIndex = 0;

  value.replace(TOKEN_RE, (token, offset: number) => {
    html += escapeHtml(value.slice(lastIndex, offset));
    html += `<span class="${classForToken(token, value, offset)}">${escapeHtml(token)}</span>`;
    lastIndex = offset + token.length;
    return token;
  });

  return html + escapeHtml(value.slice(lastIndex));
};

const highlightNode = (node: Node) => {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent || '';
    if (!text.trim()) return;

    const template = document.createElement('template');
    template.innerHTML = highlightText(text);
    node.parentNode?.replaceChild(template.content, node);
    return;
  }

  if (!(node instanceof HTMLElement)) return;
  if (node.dataset.highlighted === 'true') return;

  Array.from(node.childNodes).forEach(highlightNode);
};

const attachCopyButton = (frame: HTMLElement, code: HTMLElement) => {
  const button = frame.querySelector<HTMLButtonElement>('.code-copy');
  if (!button) return;

  button.addEventListener('click', async () => {
    const originalLabel = button.textContent || 'Copy';

    try {
      const text = code.textContent || '';
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        (document as unknown as { execCommand: (cmd: string) => boolean }).execCommand('copy');
        textarea.remove();
      }
      button.textContent = 'Copied';
      button.classList.add('is-copied');
    } catch {
      button.textContent = 'Failed';
    }

    setTimeout(() => {
      button.textContent = originalLabel;
      button.classList.remove('is-copied');
    }, 1400);
  });
};

export function enhanceCodeBlocks(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('pre > code').forEach(code => {
    const pre = code.parentElement;
    if (!pre || pre.parentElement?.classList.contains('code-frame')) return;
    if (pre.closest('.quiz-card, .quiz-q, .quiz-exp-text')) return;

    highlightNode(code);
    code.dataset.highlighted = 'true';

    const frame = document.createElement('div');
    frame.className = 'code-frame';
    frame.innerHTML = `
      <div class="code-toolbar">
        <span class="code-lang">Playwright</span>
        <button class="code-copy" type="button" aria-label="Copy code">Copy</button>
      </div>
    `;

    pre.parentNode?.insertBefore(frame, pre);
    frame.appendChild(pre);
    attachCopyButton(frame, code);
  });
}
