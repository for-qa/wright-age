import type { Question } from '../entities/Question';

export interface IQuizRepository {
  getQuestionsForTopic(topicFile: string): Question[];
}
