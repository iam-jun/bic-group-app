import { IQuizzesState } from '../index';
import showToastError from '~/store/helper/showToastError';

const deleteQuizLocal = (get) => (quizId: string) => {
  if (!quizId) {
    console.warn('\x1b[31m🐣️ deleteQuizLocal: Id not found\x1b[0m');
    return;
  }

  try {
    const { data, actions }: IQuizzesState = get();
    const deletedQuiz = {
      ...data[quizId],
      id: quizId,
      deleted: true,
    };
    actions.addOrUpdateQuiz(deletedQuiz);
  } catch (error) {
    showToastError(error);
  }
};

export default deleteQuizLocal;
