import type { Question } from '../entities/Question';

export class SubmitQuizAnswerUseCase {
  execute(question: Question, selectedIndex: number): boolean {
    return question.answerIndex === selectedIndex;
  }
}
