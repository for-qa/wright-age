import type { IProgressRepository } from '../../core/repositories/IProgressRepository';
import type { UserProgress } from '../../core/entities/UserProgress';

const STORAGE_KEY = 'pw-learning-progress';

export class LocalStorageProgressRepo implements IProgressRepository {
  getProgress(): UserProgress {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return { completedTopics: data ? JSON.parse(data) : {} };
    } catch {
      return { completedTopics: {} };
    }
  }

  markComplete(topicFile: string): void {
    const progress = this.getProgress();
    progress.completedTopics[topicFile] = Date.now();
    this.save(progress);
  }

  markIncomplete(topicFile: string): void {
    const progress = this.getProgress();
    delete progress.completedTopics[topicFile];
    this.save(progress);
  }

  private save(progress: UserProgress): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress.completedTopics));
    } catch {
      // storage unavailable
    }
  }
}
