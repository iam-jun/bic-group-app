import { IQuizzesState } from '..';
import streamApi from '~/api/StreamApi';
import showToastError from '~/store/helper/showToastError';
import showToastSuccess from '~/store/helper/showToastSuccess';
import { IQuiz, QuestionItem } from '~/interfaces/IQuiz';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';

const navigation = withNavigation(rootNavigationRef);

const createQuestionQuiz = (set, get) => async (quizId: string, question: QuestionItem) => {
  const { actions, data }: IQuizzesState = get();

  try {
    set((state: IQuizzesState) => {
      state.loading = true;
    }, 'createQuestionQuiz');

    const response = await streamApi.createQuestionQuiz(quizId, question);

    if (!response || !response.data) {
      throw new Error('wrong response');
    }

    set((state: IQuizzesState) => {
      state.loading = false;
    }, 'createQuestionQuiz success');

    const quiz = data[quizId];
    const { questions = [] } = quiz || {};
    const newQuestions = [...questions, { ...response.data }];
    const newQuiz: IQuiz = {
      ...quiz,
      questions: newQuestions,
    };

    actions.addOrUpdateQuiz(newQuiz);
    navigation.goBack();
    showToastSuccess(response);
  } catch (error) {
    console.error('deleteQuestionQuiz error', error);
    set((state: IQuizzesState) => {
      state.loading = false;
    }, 'createQuestionQuiz failed');

    showToastError(error);
  }
};

export default createQuestionQuiz;
