import { IQuizzesState } from '..';
import streamApi from '~/api/StreamApi';
import showToastError from '~/store/helper/showToastError';
import showToastSuccess from '~/store/helper/showToastSuccess';
import { IQuiz } from '~/interfaces/IQuiz';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';

const navigation = withNavigation(rootNavigationRef);

const deleteQuestionQuiz = (_set, get) => async (quizId: string, questionId: string) => {
  const { actions, data }: IQuizzesState = get();

  try {
    const response = await streamApi.deleteQuestionQuiz(quizId, questionId);

    const quiz = data[quizId];
    const { questions = [] } = quiz || {};
    const newQuestions = questions.filter((question) => question.id !== questionId);
    const newQuiz: IQuiz = {
      ...quiz,
      questions: newQuestions,
    };

    actions.addOrUpdateQuiz(newQuiz);
    navigation.goBack();
    showToastSuccess(response);
  } catch (error) {
    console.error('deleteQuestionQuiz error', error);
    showToastError(error);
  }
};

export default deleteQuestionQuiz;
