import {
  TakingQuestionItem,
  UserAnswerItem,
} from "~/interfaces/IQuiz";

export const mapQuestionReview = (
  userAnswers: UserAnswerItem[],
  questions: TakingQuestionItem[],
) => {
  return questions?.map((question) => {
    let newAnswers = [...question?.answers];
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
};
