import i18next from 'i18next';
import usePostsStore from '~/store/entities/posts';
import useQuizzesStore from '~/store/entities/quizzes';

export const MAX_QUESTIONS = 50;
export const MAX_ANSWERS = 6;

export const mapIndexToAlphabet = ['A', 'B', 'C', 'D', 'E', 'F'];

export const handleQuizNotificationSocket = (msg: any) => {
  const { activities = [] } = msg || {};
  const { quizInfo } = activities[0] || {};
  const { quizId, contentId } = quizInfo || {};

  const { waitingProcessingQuiz, actions: actionsQuizzesStore } = useQuizzesStore.getState();

  // if user is still standing in ComposeQuiz screen to wait for generating quiz
  // then getQuizDetail & getPostDetail for getting the new quiz's status
  if (waitingProcessingQuiz === quizId) {
    actionsQuizzesStore.getQuizDetail({ quizId, isShowLoading: false });
    usePostsStore.getState().actions.getContentDetail(contentId);
  }
};

export const validateSpaceTrap = (value): any => value.trim().length > 0 || i18next.t('quiz:this_field_must_not_be_empty');

export const validateIntegerNumber = (value): any => Number.isInteger(Number(value)) || i18next.t('quiz:enter_an_integer');
