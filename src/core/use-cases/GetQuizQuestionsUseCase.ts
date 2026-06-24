import type { IQuizRepository } from '../repositories/IQuizRepository';
import type { Question } from '../entities/Question';

export class GetQuizQuestionsUseCase {
  private readonly quizRepo: IQuizRepository;
  constructor(quizRepo: IQuizRepository) {
    this.quizRepo = quizRepo;
  }

  execute(topicFile: string): Question[] {
    return this.quizRepo.getQuestionsForTopic(topicFile);
  }
}
