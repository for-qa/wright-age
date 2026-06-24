import type { UserProgress } from '../entities/UserProgress';

export interface IProgressRepository {
  getProgress(): UserProgress;
  markComplete(topicFile: string): void;
  markIncomplete(topicFile: string): void;
}
