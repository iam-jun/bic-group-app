import i18next from 'i18next';
import usePostsStore from '~/store/entities/posts';
import useQuizzesStore from '~/store/entities/quizzes';

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
    usePostsStore.getState().actions.getPostDetail({ postId: contentId });
  }
};

export const validateSpaceTrap = (value) => value.trim().length > 0;

export const validateIntegerNumber = (value): any => Number.isInteger(Number(value)) || i18next.t('quiz:enter_an_integer');
