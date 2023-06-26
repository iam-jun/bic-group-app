import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Header from '~/beinComponents/Header';
import { spacing } from '~/theme';
import useGenerateQuiz from './hooks/useGenerateQuiz';
import TitleDescriptionSection from './components/TitleDescriptionSection';
import QuestionAnswerSection from './components/QuestionAnswerSection';
import QuestionAnswerDisplaySection from './components/QuestionAnswerDisplaySection';
import CheckmarkGenerateRandomQuiz from './components/CheckmarkGenerateRandomQuiz';
import { useBackPressListener } from '~/hooks/navigation';

const GenerateQuiz = () => {
  const {
    control, onNext, enabledBtnNext, watch, trigger, handleBack,
  } = useGenerateQuiz();
  const theme = useTheme();
  const styles = createStyle(theme);

  useBackPressListener(handleBack);

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <Header
        useI18n
        title="quiz:generate_quiz"
        buttonProps={{ disabled: !enabledBtnNext, loading: false, style: styles.btnSave }}
        buttonText="common:btn_next"
        onPressButton={onNext}
        onPressBack={handleBack}
      />
      <View style={styles.containerContent}>
        <TitleDescriptionSection control={control} />
        <QuestionAnswerSection control={control} />
        <QuestionAnswerDisplaySection control={control} watch={watch} trigger={trigger} />
        <CheckmarkGenerateRandomQuiz />
      </View>
    </KeyboardAwareScrollView>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  const insets = useSafeAreaInsets();

  return StyleSheet.create({
    container: {
      flex: 1,
    },
    containerContent: {
      flex: 1,
      paddingHorizontal: spacing.padding.large,
      paddingTop: spacing.padding.large,
      paddingBottom: spacing.padding.large + insets.bottom,
      backgroundColor: colors.white,
    },
    btnSave: {
      marginRight: spacing.margin.small,
    },
  });
};

export default GenerateQuiz;
