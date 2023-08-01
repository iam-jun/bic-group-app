import i18n from 'i18next';
import streamApi from '~/api/StreamApi';
import showToastError from '~/store/helper/showToastError';
import { ITakeQuizState } from '../index';
import { IPayloadStartQuiz } from '~/interfaces/IQuiz';
import APIErrorCode from '~/constants/apiErrorCode';
import showAlert from '~/store/helper/showAlert';
import { useRootNavigation } from '~/hooks/navigation';

const startQuiz = (set, get) => async (payload: IPayloadStartQuiz) => {
  const { quizId, onSuccess } = payload || {};
  const { actions }: ITakeQuizState = get();

  if (!quizId) return;

  try {
    set((state: ITakeQuizState) => {
      state.isPrepareTakingQuiz = true;
    }, 'startQuiz Prepare');

    const response = await streamApi.startQuiz(quizId);

    const newParticipantId = response?.data;
    actions.addToQuizParticipants(quizId, newParticipantId);

    onSuccess?.(newParticipantId);
  } catch (error) {
    if (
      error?.code === APIErrorCode.Post.QUIZ_DELETED
      || error?.code === APIErrorCode.Post.POST_DELETED
    ) {
      showAlert({
        title: error?.meta?.message || i18n.t('quiz:label_quiz_deleted'),
        confirmBtnProps: { type: 'ghost' },
        onConfirm: () => {
          useRootNavigation().goHome();
        },
      });
    } else {
      showToastError(error);
    }

    console.error('startQuiz error', error);
  }
};

export default startQuiz;
