import { IQuizzesState } from '..';
import streamApi from '~/api/StreamApi';
import showToastError from '~/store/helper/showToastError';
import usePostsStore from '../../posts';
import { EditQuizActionsParams } from '~/interfaces/IQuiz';
import useDraftQuizStore from '~/screens/YourContent/components/Quiz/store';

const editQuiz = (set, get) => async (editQuizActionsParams: EditQuizActionsParams) => {
  const {
    quizId, params, onSuccess,
  } = editQuizActionsParams;
  try {
    const { actions }: IQuizzesState = get();
    set((state: IQuizzesState) => {
      state.loading = true;
    }, 'editQuiz');

    const response = await streamApi.editQuiz(quizId, params);

    if (!response || !response.data) {
      throw new Error('wrong response');
    }

    set((state: IQuizzesState) => {
      state.loading = false;
    }, 'editQuiz');

    actions.addOrUpdateQuiz(response.data);
    usePostsStore.getState().actions.getContentDetail(response.data.contentId);
    useDraftQuizStore.getState().actions.getDraftQuiz(true);

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
