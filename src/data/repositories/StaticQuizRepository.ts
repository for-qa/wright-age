import type { IQuizRepository } from '../../core/repositories/IQuizRepository';
import type { Question } from '../../core/entities/Question';
import { plainQuizOption } from '../../core/utils/quizOptionText';
import { quizData } from '../static/quiz-data';

export class StaticQuizRepository implements IQuizRepository {
  getQuestionsForTopic(topicFile: string): Question[] {
    return (quizData[topicFile] || []).map((q) => ({
      ...q,
      options: q.options.map(plainQuizOption),
    }));
  }
}
