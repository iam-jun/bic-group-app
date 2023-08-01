import {
  TakingQuestionItem,
  UserAnswerItem,
} from '~/interfaces/IQuiz';

export const mapQuestionReview = (
  userAnswers: UserAnswerItem[],
  questions: TakingQuestionItem[] = [],
) => questions?.map((question) => {
  const newAnswers = [...question?.answers];
  const questionChoosedAnswer = userAnswers?.find((item) => item?.questionId === question?.id);

  if (questionChoosedAnswer) {
    const correctAnswerIndex
        = question?.answers?.findIndex((item) => item?.id === questionChoosedAnswer.answerId);

    if (correctAnswerIndex !== -1) {
      const updateAnswer = {
        ...question.answers[correctAnswerIndex],
        isCorrect: true,
      };

      newAnswers[correctAnswerIndex] = updateAnswer;

      return {
        ...question,
        answers: newAnswers,
      };
    }
  }

  return question;
});

export const getTimeValues = (countDown) => {
  const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

  return {
    days, hours, minutes, seconds,
  };
};
