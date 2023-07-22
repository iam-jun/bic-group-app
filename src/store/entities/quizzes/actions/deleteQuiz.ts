import { IQuizzesState } from '..';
import streamApi from '~/api/StreamApi';
import showToastError from '~/store/helper/showToastError';
import usePostsStore from '../../posts';
import showToastSuccess from '~/store/helper/showToastSuccess';

const deleteQuiz = (set, _get) => async (quizId: string, contentId: string) => {
  try {
    set((state: IQuizzesState) => {
      state.loading = true;
    }, 'deleteQuiz');

    const response = await streamApi.deleteQuiz(quizId);

    set((state: IQuizzesState) => {
      state.loading = false;
    }, 'deleteQuiz');

    usePostsStore.getState().actions.getPostDetail({ postId: contentId });

    showToastSuccess(response);
  } catch (error) {
    console.error('deleteQuiz error', error);
    set((state: IQuizzesState) => {
      state.loading = false;
    }, 'deleteQuiz');

    showToastError(error);
  }
};

export default deleteQuiz;
