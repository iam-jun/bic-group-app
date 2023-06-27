export type FormGenerateQuiz = {
  title: string;
  description?: string;
  numberOfQuestions: number | null;
  numberOfAnswers: number | null;
  numberOfQuestionsDisplay?: number | null;
  numberOfAnswersDisplay?: number | null;
  isRandom?: boolean;
};

export type GenerateQuizParams = FormGenerateQuiz & {
    contentId: string;
}

export type AnswerItem = {
    answer: string;
    isCorrect: boolean;
}

export type QuestionItem = {
    question: string;
    answers: AnswerItem[];
}

export interface IQuiz extends GenerateQuizParams {
    id: string;
    questions: QuestionItem[];
}
