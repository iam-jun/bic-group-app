import streamApi from '~/api/StreamApi';
import showToastError from '~/store/helper/showToastError';
import { ITakeQuizState } from '../index';
import { isEmpty } from 'lodash';

const getQuizParticipant = (set, get) => async (quizParticipantId: string) => {
  const { actions, takingQuiz }: ITakeQuizState = get();

  if (!quizParticipantId) return;

  try {
    if(isEmpty(takingQuiz[quizParticipantId])) {
      actions.initDataTakingQuiz(quizParticipantId);
    }

    const response = await streamApi.getQuizParticipant(quizParticipantId);

    set((state: ITakeQuizState) => {
      state.isPrepareTakingQuiz = false;
      state.takingQuiz[quizParticipantId].userAnswers = response?.data?.userAnswers;
      state.participantResult[quizParticipantId] = response?.data;
    }, `getQuizParticipant prepare done ${quizParticipantId}`);    
  } catch (error) {
    console.error('getQuizParticipant error', error);
    showToastError(error);
  }
};

export default getQuizParticipant;
