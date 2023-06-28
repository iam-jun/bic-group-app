import { IQuizzesState } from '..';
import streamApi from '~/api/StreamApi';
import showToastError from '~/store/helper/showToastError';
import usePostsStore from '../../posts';
import { EditQuizActionsParams } from '~/interfaces/IQuiz';

const editQuiz = (set, get) => async (editQuizActionsParams: EditQuizActionsParams) => {
  const { idQuiz, params, onSuccess } = editQuizActionsParams;
  try {
    const { actions }: IQuizzesState = get();
    set((state: IQuizzesState) => {
      state.loading = true;
    }, 'editQuiz');

    const response = await streamApi.editQuiz(idQuiz, params);

    if (!response || !response.data) {
      throw new Error('wrong response');
    }

    set((state: IQuizzesState) => {
      state.loading = false;
    }, 'editQuiz');

    actions.addOrUpdateQuiz(response.data);
    usePostsStore.getState().actions.getPostDetail({ postId: response.data.contentId });

    onSuccess?.(response);
  } catch (error) {
    console.error('editQuiz error', error);
    set((state: IQuizzesState) => {
      state.loading = false;
    }, 'editQuiz');
    showToastError(error);
  }
};

export default editQuiz;
