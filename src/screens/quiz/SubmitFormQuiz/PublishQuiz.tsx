/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-imports */
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { isNumber } from 'lodash';
import Header from '~/beinComponents/Header';
import { spacing } from '~/theme';
import useGenerateQuiz from './hooks/useGenerateQuiz';
import TitleDescriptionSection from './components/TitleDescriptionSection';
import QuestionAnswerSection from './components/QuestionAnswerSection';
import QuestionAnswerDisplaySection from './components/QuestionAnswerDisplaySection';
import CheckmarkGenerateRandomQuiz from './components/CheckmarkGenerateRandomQuiz';
import { useBackPressListener } from '~/hooks/navigation';
import useQuizzesStore from '~/store/entities/quizzes';
import { FormGenerateQuiz, QuizStatus } from '~/interfaces/IQuiz';

type PublishQuizProps = {
  route?: {
    params?: {
      quizId: string;
    };
  };
};

const PublishQuiz: FC<PublishQuizProps> = (props) => {
  const { route } = props;
  const { params } = route || {};
  const { quizId } = params || {};

  const quiz = useQuizzesStore((state) => state.data[quizId]);
  const {
    contentId,
    title,
    description,
    numberOfQuestions,
    numberOfQuestionsDisplay,
    status,
  } = quiz || {};

  const initFormData: FormGenerateQuiz = {
    title,
    description,
    numberOfQuestions: isNumber(numberOfQuestions)
      ? `${numberOfQuestions}`
      : numberOfQuestions,
    numberOfQuestionsDisplay: isNumber(numberOfQuestionsDisplay)
      ? `${numberOfQuestionsDisplay}`
      : numberOfQuestionsDisplay,
  };
  const {
    control,
    onPublishOrSaveQuiz,
    isFormValid,
    loading,
    watch,
    trigger,
    handleBack,
  } = useGenerateQuiz(contentId, initFormData);

  const disabled = !isFormValid || loading;
  const isPublishQuiz = status !== QuizStatus.PUBLISHED;

  const theme = useTheme();
  const styles = createStyle(theme);

  useBackPressListener(handleBack);

  return (
    <View style={styles.container}>
      <Header
        useI18n
        title="quiz:quiz_information"
        buttonProps={{
          disabled,
          loading,
          style: styles.btnCreate,
        }}
        buttonText={isPublishQuiz ? 'common:btn_create' : 'common:btn_save'}
        onPressButton={onPublishOrSaveQuiz(quizId, isPublishQuiz)}
        onPressBack={handleBack}
      />
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={styles.containerContent}
      >
        <TitleDescriptionSection control={control} />
        <QuestionAnswerDisplaySection
          control={control}
          watch={watch}
          trigger={trigger}
        />
        <CheckmarkGenerateRandomQuiz />
      </KeyboardAwareScrollView>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  const insets = useSafeAreaInsets();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    containerContent: {
      paddingHorizontal: spacing.padding.large,
      paddingTop: spacing.padding.large,
      paddingBottom: spacing.padding.large + insets.bottom,
    },
    btnCreate: {
      marginRight: spacing.margin.small,
    },
  });
};

export default PublishQuiz;
