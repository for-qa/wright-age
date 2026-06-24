import { describe, expect, it } from 'vitest';
import { SubmitQuizAnswerUseCase } from './SubmitQuizAnswerUseCase';
import type { Question } from '../entities/Question';

const sampleQuestion: Question = {
  section: 'gs-install',
  question: 'Which command initializes a new Playwright project?',
  options: ['npm install playwright', 'npx playwright install', 'npm init playwright@latest', 'npx create-playwright'],
  answerIndex: 2,
  explanation: '<code>npm init playwright@latest</code> scaffolds a full project.',
};

describe('SubmitQuizAnswerUseCase', () => {
  const useCase = new SubmitQuizAnswerUseCase();

  it('returns true when the selected index matches the answer', () => {
    expect(useCase.execute(sampleQuestion, 2)).toBe(true);
  });

  it('returns false when the selected index is wrong', () => {
    expect(useCase.execute(sampleQuestion, 0)).toBe(false);
    expect(useCase.execute(sampleQuestion, 1)).toBe(false);
  });
});
