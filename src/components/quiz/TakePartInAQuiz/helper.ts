import i18next from 'i18next';
import { withNavigation } from '~/router/helper';
import quizStack from '~/router/navigator/MainStack/stacks/quizStack/stack';
import { rootNavigationRef } from '~/router/refs';
import showAlert from '~/store/helper/showAlert';

const navigation = withNavigation?.(rootNavigationRef);

const onStartTakeQuiz = (quizId, contentId) => {
  navigation.navigate(quizStack.takeQuiz, { quizId, contentId });
};

export const onPressTakeQuiz = (quizId, contentId) => {
  showAlert({
    title: i18next.t('quiz:title_alert_take_quiz'),
    content: i18next.t('quiz:content_alert_take_quiz'),
    cancelBtn: true,
    confirmLabel: i18next.t('quiz:btn_start'),
    onConfirm: () => onStartTakeQuiz(quizId, contentId),
  });
};

export const onViewReport = (quizId) => {
  navigation.navigate(quizStack.scoreboard, { quizId });
};
