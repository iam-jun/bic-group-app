import { GetQuizDetailParams } from '~/interfaces/IQuiz';
import { IQuizzesState } from '..';
import streamApi from '~/api/StreamApi';
import showToastError from '~/store/helper/showToastError';

const getQuizDetail = (set, get) => async (params: GetQuizDetailParams) => {
  try {
    const { quizId, isShowLoading = true } = params;

    const { actions }: IQuizzesState = get();

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
    console.error('getQuizDetail error', error);
    set((state: IQuizzesState) => {
      state.isGettingQuizDetail = false;
    }, 'getQuizDetail');
    showToastError(error);
  }
};

export default getQuizDetail;
