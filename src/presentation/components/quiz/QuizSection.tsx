import { useCallback, useState } from 'react';
import type { Question } from '../../../core/entities/Question';
import { getQuizQuestionsUseCase } from '../../../data/di/container';
import { QuizCard } from './QuizCard';

interface QuizSectionProps {
  readonly topicFile: string;
}

/** Keep self-tests short enough for one sitting. Full bank stays in data. */
export const MAX_QUIZ_QUESTIONS_PER_TOPIC = 25;

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

/**
 * Build a set of up to MAX questions.
 * When `avoidKeys` is set (from the previous set), questions not in that set
 * are taken first so two rounds can cover a bank of ≤ 2×MAX.
 */
function pickQuestionSet(
  bank: readonly Question[],
  seed: string,
  avoidKeys?: ReadonlySet<string>,
): Question[] {
  if (bank.length === 0) return [];
  if (!avoidKeys || avoidKeys.size === 0) {
    return seededShuffle(bank, seed).slice(0, MAX_QUIZ_QUESTIONS_PER_TOPIC);
  }
  const missing = bank.filter((q) => !avoidKeys.has(q.question));
  const alreadyShown = bank.filter((q) => avoidKeys.has(q.question));
  return [
    ...seededShuffle(missing, `${seed}-missing`),
    ...seededShuffle(alreadyShown, `${seed}-rest`),
  ].slice(0, MAX_QUIZ_QUESTIONS_PER_TOPIC);
}

export function QuizSection({ topicFile }: Readonly<QuizSectionProps>) {
  const questions = getQuizQuestionsUseCase.execute(topicFile);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [setIndex, setSetIndex] = useState(1);
  const [quizSeed, setQuizSeed] = useState(() => newQuizSeed());
  const [activeQuestions, setActiveQuestions] = useState<Question[]>(() =>
    pickQuestionSet(questions ?? [], `${topicFile}-init`),
  );

  const handleAnswer = useCallback((isCorrect: boolean) => {
    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
    } else {
      setWrongCount((prev) => prev + 1);
    }
  }, []);

  const handleNextSet = useCallback(() => {
    if (!questions?.length) return;
    const avoid = new Set(activeQuestions.map((q) => q.question));
    const seed = newQuizSeed();
    setQuizSeed(seed);
    setActiveQuestions(pickQuestionSet(questions, `${topicFile}-${seed}`, avoid));
    setCorrectCount(0);
    setWrongCount(0);
    setSetIndex((n) => n + 1);
  }, [questions, activeQuestions, topicFile]);

  if (activeQuestions.length === 0) return null;

  const totalAnswered = correctCount + wrongCount;
  const totalQuestions = activeQuestions.length;
  const allAnswered = totalAnswered === totalQuestions;
  const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const bankLarger = questions.length > MAX_QUIZ_QUESTIONS_PER_TOPIC;
  const missingInBank = bankLarger
    ? questions.length - activeQuestions.length
    : 0;

  return (
    <div className="sec quiz-sec" id="self-test">
      <div className="sec-label">Self Test</div>
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
        <span>
          Quick Quiz ({activeQuestions.length} questions
          {bankLarger ? ` · set ${setIndex}` : ''})
        </span>
      </h2>
      <p>
        A short check on this page — click an option to see if you&apos;re right.
        {bankLarger
          ? ` Showing ${MAX_QUIZ_QUESTIONS_PER_TOPIC} of ${questions.length}. Use Next set to favour the ${missingInBank} not in this mix.`
          : null}
      </p>
      <div className="quiz-grid">
        {activeQuestions.map((q, idx) => (
          <QuizCard
            key={`${quizSeed}-${q.question}`}
            question={q}
            index={idx}
            shuffleSeed={`${quizSeed}-${idx}-${q.question}`}
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
        <div className="quiz-next-row">
          <button type="button" className="quiz-next-btn" onClick={handleNextSet}>
            Next set
          </button>
          <span className="quiz-next-hint">
            {bankLarger
              ? 'Loads a new mix, prioritizing questions missing from this set.'
              : 'Shuffles a fresh order of these questions.'}
          </span>
        </div>
      </div>
    </div>
  );
}
