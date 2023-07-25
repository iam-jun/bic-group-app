import { IQuizzesState } from '..';
import streamApi from '~/api/StreamApi';
import showToastError from '~/store/helper/showToastError';
import usePostsStore from '../../posts';
import useYourQuizStore from '~/screens/quiz/YourQuiz/store';
import showToastSuccess from '~/store/helper/showToastSuccess';

const deleteQuiz = (set, get) => async (quizId: string, contentId: string) => {
  const { actions }: IQuizzesState = get();

  try {
    set((state: IQuizzesState) => {
      state.loading = true;
    }, 'deleteQuiz');

    const response = await streamApi.deleteQuiz(quizId);

    set((state: IQuizzesState) => {
      state.loading = false;
    }, 'deleteQuiz');

    actions.deleteQuizLocal(quizId);
    usePostsStore.getState().actions.getContentDetail(contentId);
    useYourQuizStore.getState().actions.getQuizzesContent(true);

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
