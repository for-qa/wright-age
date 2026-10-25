import { describe, expect, it } from 'vitest';
import { displayQuizOptions, plainQuizOption } from './quizOptionText';

describe('quizOptionText', () => {
  it('strips markup so correct answers are not highlighted', () => {
    expect(plainQuizOption('<code>student_name</code>')).toBe('student_name');
    expect(plainQuizOption('<b>Doesn\'t add a newline</b>')).toBe("Doesn't add a newline");
  });

  it('decodes HTML entities after stripping tags', () => {
    expect(plainQuizOption('<code>&lt;class \'int\'&gt;</code>')).toBe("<class 'int'>");
    expect(plainQuizOption('Only <code>a &lt; b and b &lt; c</code>')).toBe('Only a < b and b < c');
    expect(plainQuizOption('Promise&lt;Response&gt;')).toBe('Promise<Response>');
  });

  it('keeps literal comparison operators that are not HTML tags', () => {
    expect(plainQuizOption('a < b and b < c')).toBe('a < b and b < c');
  });

  it('pads labels to equal length to reduce longest-option cue', () => {
    const shown = displayQuizOptions(['var', 'let', 'No keyword — just assign', 'declare']);
    const lens = shown.map((s) => [...s].length);
    expect(new Set(lens).size).toBe(1);
    expect(shown[0].startsWith('var')).toBe(true);
    expect(shown[2].startsWith('No keyword')).toBe(true);
  });
});
