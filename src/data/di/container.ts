import { StaticQuizRepository } from '../repositories/StaticQuizRepository';
import { LocalStorageProgressRepo } from '../repositories/LocalStorageProgressRepo';
import { LocalStorageThemeRepo } from '../repositories/LocalStorageThemeRepo';

import { GetQuizQuestionsUseCase } from '../../core/use-cases/GetQuizQuestionsUseCase';
import { SubmitQuizAnswerUseCase } from '../../core/use-cases/SubmitQuizAnswerUseCase';
import { ToggleTopicCompleteUseCase } from '../../core/use-cases/ToggleTopicCompleteUseCase';

// Repositories
const quizRepo = new StaticQuizRepository();
const progressRepo = new LocalStorageProgressRepo();
const themeRepo = new LocalStorageThemeRepo();

// Use Cases
export const getQuizQuestionsUseCase = new GetQuizQuestionsUseCase(quizRepo);
export const submitQuizAnswerUseCase = new SubmitQuizAnswerUseCase();
export const toggleTopicCompleteUseCase = new ToggleTopicCompleteUseCase(progressRepo);
export const themeRepository = themeRepo;
export const progressRepository = progressRepo;
