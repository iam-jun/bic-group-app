import { RegenerateQuizParams } from '~/interfaces/IQuiz';
import { IQuizzesState } from '..';
import streamApi from '~/api/StreamApi';
import showToastError from '~/store/helper/showToastError';

const regenerateQuiz = (set, get) => async (idQuiz: string, params?: RegenerateQuizParams) => {
  try {
    const { actions }: IQuizzesState = get();
    set((state: IQuizzesState) => {
      state.isGenerating = true;
    }, 'regenerateQuiz');

    const response = await streamApi.regenerateQuiz(idQuiz, params);

    if (!response || !response.data) {
      throw new Error('wrong response');
    }

    set((state: IQuizzesState) => {
      state.isGenerating = false;
    }, 'regenerateQuiz');

    actions.addOrUpdateQuiz(response.data);
  } catch (error) {
    console.error('regenerateQuiz error', error);
    set((state: IQuizzesState) => {
      state.isGenerating = false;
    }, 'regenerateQuiz');
    showToastError(error);
  }
};

export default regenerateQuiz;
