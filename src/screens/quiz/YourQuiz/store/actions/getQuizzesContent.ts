import streamApi from '~/api/StreamApi';
import { IYourQuizState } from '../index';
import usePostsStore from '~/store/entities/posts';
import showToastError from '~/store/helper/showToastError';

const getQuizzesContent = (set, get) => async (isRefresh?: boolean) => {
  const {
    contentFilter,
    attributeFilter,
    data,
  }: IYourQuizState = get();
  const currentQuizzContent = data[contentFilter][attributeFilter];
  const { ids, loading, endCursor } = currentQuizzContent || {};
  const endCursorParams = isRefresh ? null : endCursor;

  if (loading) return;

  try {
    set((state: IYourQuizState) => {
      if (isRefresh) {
        state.data[contentFilter][attributeFilter].refreshing = true;
      } else {
        state.data[contentFilter][attributeFilter].loading = true;
      }
    }, 'getQuizzContent');

    const response = await streamApi.getDraftQuiz({ endCursor: endCursorParams });

  } catch (e) {
    set((state: IYourQuizState) => {
      state.data[contentFilter][attributeFilter].refreshing = false;
      state.data[contentFilter][attributeFilter].endCursor = null;
      state.data[contentFilter][attributeFilter].loading = false;
      state.data[contentFilter][attributeFilter].hasNextPage = false;
    }, 'getQuizzContent Error');
    console.error('\x1b[31m🐣️ action getDraftQuiz error: ', e, '\x1b[0m');
    showToastError(e);
  }
};

export default getQuizzesContent;
