import streamApi from '~/api/StreamApi';
import showToastError from '~/store/helper/showToastError';
import { ITakeQuizState } from '../index';
import { IPayLoadUpdateAnwsers, IParamsUpdateAnwsers } from '~/interfaces/IQuiz';

const updateAnwsers = (set, get) => async (payload: IPayLoadUpdateAnwsers) => {
  const { quizParticipantId, anwsers, isFinished } = payload || {};
  const { actions }: ITakeQuizState = get();

  try {
    const params: IParamsUpdateAnwsers = {
      isFinished,
      anwsers,
    };
    const response = await streamApi.updateAnwsers(quizParticipantId, params);
    
    console.log('updateAnwsers response: ', response);


  } catch (error) {
    console.error('updateAnwsers error', error);
    showToastError(error);
  }
};

export default updateAnwsers;
