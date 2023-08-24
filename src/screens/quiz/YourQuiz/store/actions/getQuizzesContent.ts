import streamApi from '~/api/StreamApi';
import { IYourQuizState } from '../index';
import usePostsStore from '~/store/entities/posts';
import showToastError from '~/store/helper/showToastError';
import { IParamsGetQuizzesContent } from '~/interfaces/IQuiz';
import { getParamsTypeContentQuiz } from '../helper';

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
    }, 'getQuizzesContent');

    const params: IParamsGetQuizzesContent = {
      endCursor: endCursorParams,
      status: attributeFilter,
      type: getParamsTypeContentQuiz(contentFilter),
    };
    const response = await streamApi.getQuizzesContent(params);

    const result = response?.data?.list || [];
    usePostsStore.getState().actions.addToPosts({ data: result });

    const newIds = result?.map((item) => item?.id);
    const newQuizzesContentIds = isRefresh ? newIds || [] : ids.concat(newIds || []);

    set((state: IYourQuizState) => {
      state.data[contentFilter][attributeFilter].ids = newQuizzesContentIds;
      state.data[contentFilter][attributeFilter].hasNextPage = response?.data?.meta?.hasNextPage;
      state.data[contentFilter][attributeFilter].endCursor = response?.data?.meta?.endCursor;
      state.data[contentFilter][attributeFilter].refreshing = false;
      state.data[contentFilter][attributeFilter].loading = false;
    }, 'getQuizzesContent Success');
  } catch (e) {
    set((state: IYourQuizState) => {
      state.data[contentFilter][attributeFilter].refreshing = false;
      state.data[contentFilter][attributeFilter].endCursor = null;
      state.data[contentFilter][attributeFilter].loading = false;
      state.data[contentFilter][attributeFilter].hasNextPage = false;
    }, 'getQuizzesContent Error');
    console.error('\x1b[31m🐣️ action getQuizzesContent error: ', e, '\x1b[0m');
    showToastError(e);
  }
};

export default getQuizzesContent;
