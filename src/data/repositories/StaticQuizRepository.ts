import type { IQuizRepository } from '../../core/repositories/IQuizRepository';
import type { Question } from '../../core/entities/Question';
import { quizData } from '../static/quiz-data';

export class StaticQuizRepository implements IQuizRepository {
  getQuestionsForTopic(topicFile: string): Question[] {
    return quizData[topicFile] || [];
  }
}
