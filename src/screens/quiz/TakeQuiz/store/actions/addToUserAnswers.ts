import { UserAnswerItem } from '~/interfaces/IQuiz';
import { ITakeQuizState } from '../index';

const addToUserAnswers = (set, get) => (participantId: string, payload: UserAnswerItem) => {
  const { questionId, answerId } = payload || {};

  if (!questionId || !answerId) {
    console.warn('\x1b[31m🐣️ addToUserAnswers: Id not found\x1b[0m');
    return;
  }

  try {
    const { takingQuiz }: ITakeQuizState = get();
    const { userAnswers = [] } = takingQuiz[participantId] || {};
    const newUserAnswers = [...userAnswers];

    const indexQuestion = userAnswers.findIndex((item) => item?.questionId === questionId);

    if (indexQuestion === -1) {
      newUserAnswers.push(payload);
    } else {
      const newData = {
        ...userAnswers[indexQuestion],
        ...payload,
      };
      newUserAnswers[indexQuestion] = newData;
    }

    set((state: ITakeQuizState) => {
      state.takingQuiz[participantId].userAnswers = newUserAnswers;
    }, `addToUserAnswers ${participantId}`);
  } catch (error) {
    console.warn('\x1b[31m🐣️ addToUserAnswers error\x1b[0m', error);
  }
};

export default addToUserAnswers;
