/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-imports */
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Header from '~/beinComponents/Header';
import { spacing } from '~/theme';
import useGenerateQuiz from './hooks/useGenerateQuiz';
import TitleDescriptionSection from './components/TitleDescriptionSection';
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
    status,
    questions,
  } = quiz || {};

  const inputNumberOfQuestionsDisplay = useQuizzesStore.getState().formGenerateQuiz?.numberOfQuestionsDisplay;
  const inputTitle = useQuizzesStore.getState().formGenerateQuiz?.title;
  const inputDescription = useQuizzesStore.getState().formGenerateQuiz?.description;

  const initFormData: FormGenerateQuiz = {
    title: inputTitle,
    description: inputDescription,
    numberOfQuestionsDisplay: !!inputNumberOfQuestionsDisplay
      ? `${inputNumberOfQuestionsDisplay}`
      : inputNumberOfQuestionsDisplay,
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

  const onBack = () => handleBack(false);

  useEffect(() => {
    // By default, react hook form doesn't throw error at the init stage,
    // so we need to trigger validate immediately for showing error
    trigger('numberOfQuestionsDisplay');
  }, []);

  useBackPressListener(onBack);

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
        onPressBack={onBack}
      />
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={styles.containerContent}
        alwaysBounceVertical={false}
      >
        <TitleDescriptionSection control={control} />
        <QuestionAnswerDisplaySection
          control={control}
          watch={watch}
          trigger={trigger}
          questionsLength={questions.length}
        />
        {/* <CheckmarkGenerateRandomQuiz /> */}
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
