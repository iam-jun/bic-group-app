import { IQuizzesState } from '..';
import streamApi from '~/api/StreamApi';
import showToastError from '~/store/helper/showToastError';
import showToastSuccess from '~/store/helper/showToastSuccess';
import { IQuiz, QuestionItem } from '~/interfaces/IQuiz';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';

const navigation = withNavigation(rootNavigationRef);

const editQuestionQuiz = (set, get) => async (quizId: string, question: QuestionItem) => {
  const { actions, data }: IQuizzesState = get();

  try {
    set((state: IQuizzesState) => {
      state.loading = true;
    }, 'editQuestionQuiz');

    const response = await streamApi.editQuestionQuiz(quizId, question);

    if (!response || !response.data) {
      throw new Error('wrong response');
    }

    set((state: IQuizzesState) => {
      state.loading = false;
    }, 'editQuestionQuiz success');

    const quiz = data[quizId];
    const { questions = [] } = quiz || {};
    const newQuestions = questions.map((quest) => (quest.id === question.id ? { ...response.data } : quest));
    const newQuiz: IQuiz = {
      ...quiz,
      questions: newQuestions,
    };

    actions.addOrUpdateQuiz(newQuiz);
    navigation.goBack();
    showToastSuccess(response);
  } catch (error) {
    console.error('editQuestionQuiz error', error);
    set((state: IQuizzesState) => {
      state.loading = false;
    }, 'editQuestionQuiz failed');

    showToastError(error);
  }
};

export default editQuestionQuiz;
