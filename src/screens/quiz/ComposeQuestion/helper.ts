import { AnswerItem } from '~/interfaces/IQuiz';

export const formatAnswers = (answers: AnswerItem[]): AnswerItem[] => answers.map((answerItem) => ({
  ...answerItem,
  content: answerItem.content?.trim(),
}));
