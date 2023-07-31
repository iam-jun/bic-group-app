import streamApi from '~/api/StreamApi';
import showToastError from '~/store/helper/showToastError';
import { IPayLoadUpdateAnwsers, IParamsUpdateAnwsers } from '~/interfaces/IQuiz';
import { ITakeQuizState } from '..';

const updateAnwsers = (set, get) => async (payload: IPayLoadUpdateAnwsers) => {
  const { quizParticipantId, answers, isFinished } = payload || {};
  const { actions }: ITakeQuizState = get();

  try {
    const params: IParamsUpdateAnwsers = {
      isFinished,
      answers,
    };

   await streamApi.updateAnwsers(quizParticipantId, params);
   actions.getQuizParticipant(quizParticipantId);
  } catch (error) {
    console.error('updateAnwsers error', error);
    showToastError(error);
  }
};

export default updateAnwsers;
