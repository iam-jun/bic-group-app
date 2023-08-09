import {
  IAudienceGroup,
  IAudienceUser,
  PostType,
} from './IPost';

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
  title?: string;
  description?: string;
  numberOfQuestions?: string | number | null;
  numberOfAnswers?: string | number | null;
  numberOfQuestionsDisplay?: string | number | null;
  numberOfAnswersDisplay?: string | number | null;
  isRandom?: boolean;
};

export type GenerateQuizParams = FormGenerateQuiz & {
  contentId?: string;
};

export type RegenerateQuizParams = Partial<
  Pick<FormGenerateQuiz, 'numberOfQuestions' | 'numberOfAnswers'>
>;

export type AnswerItem = {
  id: string;
  content: string;
  isCorrect: boolean;
};

export type QuestionItem = {
  id: string;
  content: string;
  answers: AnswerItem[];
};

export interface IQuiz extends GenerateQuizParams {
  id: string;
  questions: QuestionItem[];
  status: QuizStatus;
  genStatus?: GenStatus;
  createdAt?: string;
  updatedAt?: string;
  deleted?: boolean;
}

export type QuizPost = Pick<
  IQuiz,
  'id' | 'title' | 'description' | 'status' | 'createdAt' | 'updatedAt' | 'genStatus'
>;

export type EditQuizParams = Partial<Omit<IQuiz, 'id'>>;

export type EditQuizActionsParams = {
  quizId: string;
  params: EditQuizParams;
  audiences?: IAudienceGroup[];
  onSuccess?: (response: any) => void;
};

export interface IParamsGetQuizzesContent {
  limit?: number;
  endCursor?: string;
  status: AttributeQuiz;
  type?: ContentQuiz | undefined;
}

export type EditQuestionForm = {
  content: string;
  answers: AnswerItem[];
};

export type GetQuizDetailParams = {
  quizId: string;
  isShowLoading?: boolean;
  onSuccess?: () => void;
}

export enum AttributeQuiz {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

export enum ContentQuiz {
  ALL = 'ALL',
  POST = 'POST',
  ARTICLE = 'ARTICLE',
}

export interface IParamsUpdateAnwsers {
  isFinished?: boolean;
  answers: UserAnswerItem[];
}

export interface IPayLoadUpdateAnwsers extends IParamsUpdateAnwsers {
  quizParticipantId: string;
  onSuccess?: () => void;
  onErrors?: () => void;
}

export interface IPayloadStartQuiz {
  quizId: string;
  onSuccess?: (quizParticipantId: string) => void;
}

export type QuizDoing = {
  quizParticipantId?: string;
}

export type QuizHighestScore = {
  quizParticipantId?: string;
  score?: number;
}

export type UserAnswerItem = {
  questionId: string;
  answerId: string;
}

export type TakingAnswerItem = Omit<AnswerItem, 'isCorrect'>;

export type TakingQuestionItem = Omit<QuestionItem, 'answers'> & {
  answers: TakingAnswerItem[];
};

export type ParticipantContent = {
  id: string;
  type: PostType;
}

export interface IParticipantResult {
  content: ParticipantContent;
  description?: string;
  finishedAt: string;
  id: string;
  questions: TakingQuestionItem[];
  quizId: string;
  score: number;
  startedAt: string;
  timeLimit: number;
  title?: string;
  totalAnswers: number;
  totalTimes: number;
  totalCorrectAnswers: number;
  userAnswers?: UserAnswerItem[];
}

export interface ISaveAnswerTakeQuiz {
  onSuccess?: () => void;
  onErrors?: () => void;
  isFinished?: boolean;
}

export type ParticipantDetail = {
  total: number;
  pass: number;
  fail: number;
}

export interface ISummaryDetail {
  contentId: string;
  participants: ParticipantDetail;
}

export enum ResultStatus {
  PASS = 'PASS',
  FAIL = 'FAIL',
}

export interface IPayloadGetUsersParticipants {
  contentId: string;
  isRefresh?: boolean;
}

export interface IParamsGetUsersParticipants {
  limit?: number;
  endCursor?: string;
}

export interface IUserParticipant {
  id: string;
  quizId: string;
  score: number;
  status: ResultStatus;
  actor: IAudienceUser;
}
