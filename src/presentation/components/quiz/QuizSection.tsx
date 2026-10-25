import { useCallback, useMemo, useState } from 'react';
import type { Question } from '../../../core/entities/Question';
import { getQuizQuestionsUseCase } from '../../../data/di/container';
import { QuizCard } from './QuizCard';

interface QuizSectionProps {
  readonly topicFile: string;
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + (str.codePointAt(i) || 0);
    hash = Math.trunc(hash);
  }
  return Math.abs(hash);
}

function seededShuffle<T>(array: readonly T[], seedStr: string): T[] {
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

function newQuizSeed(): string {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return `${Date.now()}-${buf[0]}`;
}

function storageKey(topicFile: string): string {
  return `quiz-shuffle:${topicFile}`;
}

function readStoredSeed(topicFile: string): string | null {
  try {
    const value = localStorage.getItem(storageKey(topicFile));
    return value && value.length > 0 ? value : null;
  } catch {
    return null;
  }
}

function writeStoredSeed(topicFile: string, seed: string): void {
  try {
    localStorage.setItem(storageKey(topicFile), seed);
  } catch {
    /* private mode / quota — ignore */
  }
}

function orderQuestions(bank: readonly Question[], seed: string | null): Question[] {
  if (!seed) return [...bank];
  return seededShuffle(bank, `${seed}-questions`);
}

export function QuizSection({ topicFile }: Readonly<QuizSectionProps>) {
  const bank = useMemo(
    () => getQuizQuestionsUseCase.execute(topicFile) ?? [],
    [topicFile],
  );
  const [shuffleSeed, setShuffleSeed] = useState<string | null>(() => readStoredSeed(topicFile));
  const [activeQuestions, setActiveQuestions] = useState<Question[]>(() =>
    orderQuestions(getQuizQuestionsUseCase.execute(topicFile) ?? [], readStoredSeed(topicFile)),
  );
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  const handleAnswer = useCallback((isCorrect: boolean) => {
    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
    } else {
      setWrongCount((prev) => prev + 1);
    }
  }, []);

  const handleShuffle = useCallback(() => {
    const seed = newQuizSeed();
    writeStoredSeed(topicFile, seed);
    setShuffleSeed(seed);
    setActiveQuestions(orderQuestions(bank, seed));
    setCorrectCount(0);
    setWrongCount(0);
  }, [bank, topicFile]);

  if (activeQuestions.length === 0) return null;

  const totalAnswered = correctCount + wrongCount;
  const totalQuestions = activeQuestions.length;
  const allAnswered = totalAnswered === totalQuestions;
  const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const isShuffled = shuffleSeed !== null;

  return (
    <div className="sec quiz-sec" id="self-test">
      <div className="quiz-sec-label-row">
        <div className="sec-label">Self Test</div>
        <button
          type="button"
          className="quiz-shuffle-btn"
          onClick={handleShuffle}
          aria-label={isShuffled ? 'Reshuffle quiz questions and options' : 'Shuffle quiz questions and options'}
        >
          {isShuffled ? 'Reshuffle' : 'Shuffle'}
        </button>
      </div>
      <h2>
        <svg
          className="quiz-header-icon"
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
          <path d="M14 2v4a1 1 0 0 0 1 1h4" />
          <path d="m9 11 1 1 2-2" className="quiz-header-icon-check" />
          <path d="m9 15 1 1 2-2" className="quiz-header-icon-check" />
          <path d="M14 11h3" />
          <path d="M14 15h3" />
        </svg>
        <span>Quick Quiz ({totalQuestions} questions)</span>
      </h2>
      <p>
        Test yourself on this page — click an option to see if you&apos;re right.
        {isShuffled
          ? ' Order is shuffled and saved in this browser until you reshuffle.'
          : ' Click Shuffle to randomize question and option order (saved until you reshuffle).'}
      </p>
      <div className="quiz-grid">
        {activeQuestions.map((q, idx) => (
          <QuizCard
            key={`${shuffleSeed ?? 'natural'}-${idx}-${q.question}`}
            question={q}
            index={idx}
            shuffleSeed={shuffleSeed ? `${shuffleSeed}-${idx}-${q.question}` : ''}
            onAnswer={handleAnswer}
          />
        ))}
      </div>

      <div className={`quiz-score-summary${allAnswered ? ' quiz-score-complete' : ''}`}>
        <div className="quiz-score-header">
          <span className="quiz-score-title">
            {allAnswered ? '🎉 Quiz Complete!' : '📊 Score Tracker'}
          </span>
          <span className="quiz-score-progress">
            {totalAnswered} / {totalQuestions} answered
          </span>
        </div>
        <div className="quiz-score-bar-bg">
          <div
            className="quiz-score-bar-fill"
            style={{ width: `${totalQuestions > 0 ? (totalAnswered / totalQuestions) * 100 : 0}%` }}
          />
        </div>
        <div className="quiz-score-counts">
          <div className="quiz-score-correct">
            <span className="quiz-score-icon">✅</span>
            <span className="quiz-score-label">Correct</span>
            <span className="quiz-score-num">{correctCount}</span>
          </div>
          <div className="quiz-score-wrong">
            <span className="quiz-score-icon">❌</span>
            <span className="quiz-score-label">Wrong</span>
            <span className="quiz-score-num">{wrongCount}</span>
          </div>
          {allAnswered && (
            <div className="quiz-score-pct">
              <span className="quiz-score-icon">🏆</span>
              <span className="quiz-score-label">Score</span>
              <span className="quiz-score-num">{scorePercent}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
