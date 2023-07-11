import { IAudienceGroup } from './IPost';

export enum QuizStatus {
  PENDING = 'PENDING',
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

export enum GenStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  PROCESSED = 'PROCESSED',
  FAILED = 'FAILED',
}

export type FormGenerateQuiz = {
  title: string;
  description?: string;
  numberOfQuestions: string | number | null;
  numberOfAnswers: string | number | null;
  numberOfQuestionsDisplay?: string | number | null;
  numberOfAnswersDisplay?: string | number | null;
  isRandom?: boolean;
};

export type GenerateQuizParams = FormGenerateQuiz & {
  contentId: string;
};

export type RegenerateQuizParams = Partial<
  Pick<FormGenerateQuiz, 'numberOfQuestions' | 'numberOfAnswers'>
>;

export type AnswerItem = {
  id: string;
  answer: string;
  isCorrect: boolean;
};

export type QuestionItem = {
  id: string;
  question: string;
  answers: AnswerItem[];
};

export interface IQuiz extends GenerateQuizParams {
  id: string;
  questions: QuestionItem[];
  status: QuizStatus;
  genStatus?: GenStatus;
  createdAt?: string;
  updatedAt?: string;
}

export type QuizPost = Pick<
  IQuiz,
  'id' | 'title' | 'description' | 'status' | 'createdAt' | 'updatedAt' | 'genStatus'
>;

export type EditQuizParams = Partial<Omit<IQuiz, 'id'>>;

export type EditQuizActionsParams = {
  idQuiz: string;
  params: EditQuizParams;
  audiences?: IAudienceGroup[];
  onSuccess?: (response: IQuiz) => void;
};

export interface IParamsGetDraftQuiz {
  limit?: number;
  endCursor?: string;
}

export type EditQuestionForm = {
  question: string;
  answers: AnswerItem[];
};
