import { useCallback, useMemo, useState } from 'react';
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

export function QuizSection({ topicFile }: Readonly<QuizSectionProps>) {
  const questions = getQuizQuestionsUseCase.execute(topicFile);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [quizSeed] = useState(() => `${Date.now()}-${Math.random()}`);

  const shuffledQuestions = useMemo(() => {
    if (!questions) return [];
    return seededShuffle(questions, `${topicFile}-${quizSeed}`);
  }, [questions, topicFile, quizSeed]);

  const handleAnswer = useCallback((isCorrect: boolean) => {
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    } else {
      setWrongCount(prev => prev + 1);
    }
  }, []);

  if (shuffledQuestions.length === 0) return null;

  const totalAnswered = correctCount + wrongCount;
  const totalQuestions = shuffledQuestions.length;
  const allAnswered = totalAnswered === totalQuestions;
  const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  return (
    <div className="sec quiz-sec" id="self-test">
      <div className="sec-label">Self Test</div>
      <h2>
        <svg
          className="quiz-header-icon"
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
        <span>Quick Quiz ({shuffledQuestions.length} Questions)</span>
      </h2>
      <p>Test your understanding of every topic on this page. Click an option to check.</p>
      <div className="quiz-grid">
        {shuffledQuestions.map((q, idx) => (
          <QuizCard
            key={`${quizSeed}-${q.question}`}
            question={q}
            index={idx}
            shuffleSeed={`${quizSeed}-${idx}-${q.question}`}
            onAnswer={handleAnswer}
          />
        ))}
      </div>

      {/* Score Summary */}
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
