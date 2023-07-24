import { GenerateQuizParams, IQuiz } from '~/interfaces/IQuiz';
import { IQuizzesState } from '..';
import streamApi from '~/api/StreamApi';
import showToastError from '~/store/helper/showToastError';
import usePostsStore from '../../posts';

const generateQuiz = (set, get) => async (params: GenerateQuizParams, onSuccess?: (quiz: IQuiz) => void) => {
  try {
    const { actions }: IQuizzesState = get();
    set((state: IQuizzesState) => {
      state.isGenerating = true;
    }, 'generateQuiz');

    const response = await streamApi.generateQuiz(params);

    if (!response || !response.data) {
      throw new Error('wrong response');
    }

    set((state: IQuizzesState) => {
      state.isGenerating = false;
    }, 'generateQuiz');

    actions.addOrUpdateQuiz(response.data);
    usePostsStore.getState().actions.getContentDetail(response.data.contentId);

    onSuccess?.(response.data);
  } catch (error) {
    console.error('generateQuiz error', error);
    set((state: IQuizzesState) => {
      state.isGenerating = false;
    }, 'generateQuiz');
    showToastError(error);
  }
};

export default generateQuiz;
