export interface Question {
  readonly section: string;
  readonly question: string;
  readonly options: readonly string[];
  readonly answerIndex: number;
  readonly explanation: string;
}
