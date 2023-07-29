import streamApi from '~/api/StreamApi';
import showToastError from '~/store/helper/showToastError';
import { ITakeQuizState } from '../index';

const getQuizParticipant = (set, get) => async (quizParticipantId: string) => {
  const { actions }: ITakeQuizState = get();

  try {
    const response = await streamApi.getQuizParticipant(quizParticipantId);

    set((state: ITakeQuizState) => {
      state.isPrepareTakingQuiz = false;
      state.takingQuiz.data = response?.data;
    }, 'getQuizParticipant Prepare done');    

  } catch (error) {
    console.error('getQuizParticipant error', error);
    showToastError(error);
  }
};

export default getQuizParticipant;
