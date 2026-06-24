import { useState } from 'react';
import type { Question } from '../../../core/entities/Question';
import { submitQuizAnswerUseCase } from '../../../data/di/container';

interface QuizCardProps {
  question: Question;
  index: number;
  shuffleSeed: string;
  onAnswer?: (isCorrect: boolean) => void;
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + (str.codePointAt(i) || 0);
    hash = Math.trunc(hash);
  }
  return Math.abs(hash);
}

function seededShuffle<T>(array: T[], seedStr: string): T[] {
  const arr = [...array];
  let seed = hashString(seedStr);

  const random = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function QuizCard({ question, index, shuffleSeed, onAnswer }: Readonly<QuizCardProps>) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const [shuffledOptions] = useState(() =>
    seededShuffle(
      question.options.map((opt, i) => ({ opt, originalIndex: i })),
      shuffleSeed
    )
  );

  const handleSelect = (originalIdx: number) => {
    if (selectedIdx !== null) return;
    setSelectedIdx(originalIdx);
    onAnswer?.(originalIdx === question.answerIndex);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (selectedIdx !== null) return;
    const keyMap: Record<string, number> = { '1': 0, '2': 1, '3': 2, '4': 3 };
    const digit = keyMap[event.key];
    if (digit !== undefined) {
      event.preventDefault();
      const option = shuffledOptions[digit];
      if (option) handleSelect(option.originalIndex);
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const buttons = Array.from(
        (event.currentTarget as HTMLElement).querySelectorAll<HTMLButtonElement>('.quiz-opt:not([disabled])'),
      );
      const current = document.activeElement as HTMLButtonElement;
      const idx = buttons.indexOf(current);
      const next = event.key === 'ArrowDown'
        ? buttons[(idx + 1) % buttons.length]
        : buttons[(idx - 1 + buttons.length) % buttons.length];
      next?.focus();
    }
  };

  const isAnswered = selectedIdx !== null;
  const isCorrect = isAnswered && submitQuizAnswerUseCase.execute(question, selectedIdx);

  return (
    <div className="quiz-card" data-answer={question.answerIndex}>
      <div className="quiz-q">
        <span className="quiz-num">Q{index + 1}</span>
        <div className="quiz-q-text" dangerouslySetInnerHTML={{ __html: question.question }} />
      </div>

      <div
        className="quiz-opts"
        role="radiogroup"
        aria-label={`Question ${index + 1} options`}
        tabIndex={isAnswered ? -1 : 0}
        onKeyDown={handleKeyDown}
      >
        {shuffledOptions.map((item, oi) => {
          let btnClass = 'quiz-opt';
          if (isAnswered) {
            if (item.originalIndex === question.answerIndex) btnClass += ' quiz-correct';
            else if (item.originalIndex === selectedIdx) btnClass += ' quiz-wrong';
          }

          return (
            <button
              key={item.originalIndex}
              type="button"
              className={btnClass}
              role="radio"
              aria-checked={selectedIdx === item.originalIndex}
              onClick={() => handleSelect(item.originalIndex)}
              disabled={isAnswered}
            >
              <span className="quiz-letter">{"ABCD"[oi]}</span>
              <span dangerouslySetInnerHTML={{ __html: item.opt }} />
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className={`quiz-fb ${isCorrect ? 'quiz-fb-correct' : 'quiz-fb-wrong'}`}>
          {isCorrect ? '✅ Correct! ' : '❌ The answer is '}
          <span className="quiz-ans">
            {"ABCD"[shuffledOptions.findIndex(o => o.originalIndex === question.answerIndex)]}: {question.options[question.answerIndex].replace(/<[^>]*>?/gm, '')}
          </span>

          {question.explanation && (
            <div className="quiz-example">
              <span className="quiz-example-label">💡 Explanation:</span>
              <div className="quiz-exp-text" dangerouslySetInnerHTML={{ __html: question.explanation }} />
              {question.section && (
                <div style={{ marginTop: '0.75rem', fontSize: '13px' }}>
                  <a
                    href={`#${question.section}`}
                    style={{ color: 'var(--blue)', fontWeight: 600, textDecoration: 'none' }}
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById(question.section);
                      if (el) {
                        const headerOffset = 60;
                        const elementPosition = el.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + globalThis.scrollY - headerOffset;
                        globalThis.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                        globalThis.history.pushState(null, '', `#${question.section}`);
                      }
                    }}
                  >
                    📖 Read full topic →
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
