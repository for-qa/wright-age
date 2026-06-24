import { describe, expect, it, beforeEach } from 'vitest';
import { ToggleTopicCompleteUseCase } from './ToggleTopicCompleteUseCase';
import type { IProgressRepository } from '../repositories/IProgressRepository';
import type { UserProgress } from '../entities/UserProgress';

class InMemoryProgressRepository implements IProgressRepository {
  private progress: UserProgress = { completedTopics: {} };

  getProgress(): UserProgress {
    return this.progress;
  }

  markComplete(topicFile: string): void {
    this.progress = {
      completedTopics: { ...this.progress.completedTopics, [topicFile]: Date.now() },
    };
  }

  markIncomplete(topicFile: string): void {
    const next = { ...this.progress.completedTopics };
    delete next[topicFile];
    this.progress = { completedTopics: next };
  }
}

describe('ToggleTopicCompleteUseCase', () => {
  let repo: InMemoryProgressRepository;
  let useCase: ToggleTopicCompleteUseCase;

  beforeEach(() => {
    repo = new InMemoryProgressRepository();
    useCase = new ToggleTopicCompleteUseCase(repo);
  });

  it('marks a topic complete', () => {
    useCase.markComplete('pw-getting-started.html');
    expect(repo.getProgress().completedTopics['pw-getting-started.html']).toBeTypeOf('number');
  });

  it('marks a topic incomplete', () => {
    useCase.markComplete('pw-getting-started.html');
    useCase.markIncomplete('pw-getting-started.html');
    expect(repo.getProgress().completedTopics['pw-getting-started.html']).toBeUndefined();
  });
});
