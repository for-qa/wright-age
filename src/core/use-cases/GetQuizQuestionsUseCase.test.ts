import { describe, expect, it } from 'vitest';
import { GetQuizQuestionsUseCase } from './GetQuizQuestionsUseCase';
import type { IQuizRepository } from '../repositories/IQuizRepository';
import type { Question } from '../entities/Question';

const mockQuestions: Question[] = [
  {
    section: 'gs-install',
    question: 'Which command initializes a new Playwright project?',
    options: ['npm install playwright', 'npx playwright install', 'npm init playwright@latest', 'npx create-playwright'],
    answerIndex: 2,
    explanation: '<code>npm init playwright@latest</code> scaffolds a full project.',
  },
];

class MockQuizRepository implements IQuizRepository {
  getQuestionsForTopic(topicFile: string): Question[] {
    return topicFile === 'pw-getting-started.html' ? mockQuestions : [];
  }
}

describe('GetQuizQuestionsUseCase', () => {
  const useCase = new GetQuizQuestionsUseCase(new MockQuizRepository());

  it('returns questions for a known topic file', () => {
    expect(useCase.execute('pw-getting-started.html')).toHaveLength(1);
    expect(useCase.execute('pw-getting-started.html')[0].section).toBe('gs-install');
  });

  it('returns an empty array for unknown topics', () => {
    expect(useCase.execute('missing-topic.html')).toEqual([]);
  });
});
