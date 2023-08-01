import { AnswerItem } from '~/interfaces/IQuiz';

export const formatAnswers = (answers: AnswerItem[]) => answers.map((answerItem) => ({
  ...answerItem,
  answer: answerItem.content?.trim(),
}));
