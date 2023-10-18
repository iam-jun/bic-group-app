import React from 'react';
import { StyleSheet } from 'react-native';
import i18next from 'i18next';
import { IAudience } from '~/interfaces/IPost';
import Text from '~/baseComponents/Text';
import showAlert from '~/store/helper/showAlert';
import { spacing } from '~/theme';
import { FormGenerateQuiz, GenerateQuizParams } from '~/interfaces/IQuiz';

/* istanbul ignore next */
export const showAlertAudienceListWithNoPermissionQuiz = (audiences: IAudience[]) => {
  const lstAudienceNamesNotPermit = audiences
    .map((audience) => audience?.name)
    .join(', ');
  const alertPayload = {
    title: i18next.t('post:post_setting_permissions_alert:title'),
    children: (
      <Text.BodyM style={styles.childrenText}>
        {`${i18next.t('post:post_setting_permissions_alert:description_1')}`}
        <Text.BodyMMedium>{lstAudienceNamesNotPermit}</Text.BodyMMedium>
        {`${i18next.t('post:post_setting_permissions_alert:description_2')}`}
      </Text.BodyM>
    ),
    onConfirm: null,
    cancelBtn: true,
  };
  showAlert(alertPayload);
};

export const buildGenerateQuizParams = (data: FormGenerateQuiz, contentId?: string): GenerateQuizParams => {
  const {
    title,
    description,
    numberOfQuestions,
    numberOfAnswers,
    numberOfQuestionsDisplay,
    numberOfAnswersDisplay,
  } = data;
  const params: GenerateQuizParams = {
    title: !!title ? title.trim() : title,
    description: !!description ? description.trim() : description,
    numberOfQuestions: Number(numberOfQuestions),
    numberOfAnswers: Number(numberOfAnswers),
    numberOfQuestionsDisplay: !!numberOfQuestionsDisplay
      ? Number(numberOfQuestionsDisplay)
      : null,
    numberOfAnswersDisplay: !!numberOfAnswersDisplay
      ? Number(numberOfAnswersDisplay)
      : null,
    contentId,
    isRandom: true,
  };
  return params;
};

const styles = StyleSheet.create({
  childrenText: {
    paddingTop: spacing.padding.tiny,
    paddingBottom: spacing.padding.base,
    paddingHorizontal: spacing.padding.large,
  },
});
