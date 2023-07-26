import { GetQuizDetailParams } from '~/interfaces/IQuiz';
import { IQuizzesState } from '..';
import streamApi from '~/api/StreamApi';
import showToastError from '~/store/helper/showToastError';
import APIErrorCode from '~/constants/apiErrorCode';

const getQuizDetail = (set, get) => async (params: GetQuizDetailParams) => {
  const { quizId, isShowLoading = true } = params;
  const { actions }: IQuizzesState = get();

  try {
    set((state: IQuizzesState) => {
      state.isGettingQuizDetail = isShowLoading;
    }, 'getQuizDetail');

    const response = await streamApi.getQuizDetail(quizId);

    if (!response || !response.data) {
      throw new Error('wrong response');
    }

    set((state: IQuizzesState) => {
      state.isGettingQuizDetail = false;
    }, 'getQuizDetail');

    actions.addOrUpdateQuiz(response.data);
  } catch (error) {
    if (
      error?.code === APIErrorCode.Post.QUIZ_DELETED
      || error?.code === APIErrorCode.Post.POST_DELETED
    ) {
      actions.deleteQuizLocal(quizId);
    }

    console.error('getQuizDetail error', error);
    set((state: IQuizzesState) => {
      state.isGettingQuizDetail = false;
    }, 'getQuizDetail');
    showToastError(error);
  }
};

export default getQuizDetail;
