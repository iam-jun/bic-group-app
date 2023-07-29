import streamApi from '~/api/StreamApi';
import showToastError from '~/store/helper/showToastError';
import { ITakeQuizState } from '../index';
import { IPayloadStartQuiz } from '~/interfaces/IQuiz';

const startQuiz = (set, get) => async (payload: IPayloadStartQuiz) => {
  const { quizId, onSuccess } = payload || {};
  const { actions }: ITakeQuizState = get();

  try {
    set((state: ITakeQuizState) => {
      state.isPrepareTakingQuiz = true;
    }, 'startQuiz Prepare');    

    const response = await streamApi.startQuiz(quizId);

    const newParticipantId = response?.data;
    actions.addToQuizParticipants(quizId, newParticipantId);

    onSuccess?.(newParticipantId);
  } catch (error) {
    console.error('startQuiz error', error);
    showToastError(error);
  }
};

export default startQuiz;
