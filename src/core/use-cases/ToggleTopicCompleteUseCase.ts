import type { IProgressRepository } from '../repositories/IProgressRepository';

export class ToggleTopicCompleteUseCase {
  private readonly progressRepo: IProgressRepository;
  constructor(progressRepo: IProgressRepository) {
    this.progressRepo = progressRepo;
  }

  markComplete(topicFile: string): void {
    this.progressRepo.markComplete(topicFile);
  }

  markIncomplete(topicFile: string): void {
    this.progressRepo.markIncomplete(topicFile);
  }
}
