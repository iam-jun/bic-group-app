export enum QuizStatus {
  PENDING = 'PENDING',
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
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
  answer: string;
  isCorrect: boolean;
};

export type QuestionItem = {
  question: string;
  answers: AnswerItem[];
};

export interface IQuiz extends GenerateQuizParams {
  id: string;
  questions: QuestionItem[];
  status: QuizStatus;
  createdAt?: string;
  updatedAt?: string;
}

export type QuizPost = Pick<IQuiz, 'id' | 'title' | 'description' | 'status' | 'createdAt' | 'updatedAt'>

export type EditQuizParams = Partial<Omit<IQuiz, 'id'>>;

export type EditQuizActionsParams = {
  idQuiz: string;
  params: EditQuizParams;
  onSuccess?: (response: IQuiz) => void;
};
