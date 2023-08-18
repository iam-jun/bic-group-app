import streamApi from '~/api/StreamApi';
import showToastError from '~/store/helper/showToastError';
import { IPayLoadUpdateAnwsers, IParamsUpdateAnwsers } from '~/interfaces/IQuiz';
import { ITakeQuizState } from '..';
import APIErrorCode from '~/constants/apiErrorCode';

const updateAnwsers = (get) => async (payload: IPayLoadUpdateAnwsers) => {
  const {
    quizParticipantId,
    answers,
    isFinished,
    onSuccess,
    onErrors,
  } = payload || {};
  const { actions }: ITakeQuizState = get();

  if (!quizParticipantId) return;

  try {
    const params: IParamsUpdateAnwsers = {
      isFinished,
      answers,
    };

    await streamApi.updateAnwsers(quizParticipantId, params);
    actions.getQuizParticipant(quizParticipantId, true);
    onSuccess?.();
  } catch (error) {
    if (error?.code === APIErrorCode.Post.QUIZ_OVER_TIME) {
      onErrors?.();
    } else {
      showToastError(error);
    }

    console.error('updateAnwsers error', error);
  }
};

export default updateAnwsers;
