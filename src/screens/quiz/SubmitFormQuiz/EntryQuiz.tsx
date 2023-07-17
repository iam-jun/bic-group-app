import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Header from '~/beinComponents/Header';
import { spacing } from '~/theme';
import useGenerateQuiz from './hooks/useGenerateQuiz';
import QuestionAnswerSection from './components/QuestionAnswerSection';
import { useBackPressListener } from '~/hooks/navigation';

type EntryQuizProps = {
  route?: {
    params?: {
      postId: string;
    };
  };
};

const EntryQuiz: FC<EntryQuizProps> = (props) => {
  const { route } = props;
  const { params } = route || {};
  const { postId } = params || {};

  const {
    control,
    onNext,
    isFormValid,
    isGenerating,
    handleBack,
  } = useGenerateQuiz(postId);

  const disabled = !isFormValid || isGenerating;

  const theme = useTheme();
  const styles = createStyle(theme);

  useBackPressListener(handleBack);

  return (
    <View style={styles.container}>
      <Header
        useI18n
        title="quiz:create_quiz"
        buttonProps={{
          disabled,
          loading: isGenerating,
          style: styles.btnSave,
        }}
        buttonText="common:btn_next"
        onPressButton={onNext}
        onPressBack={handleBack}
      />
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={styles.containerContent}
      >
        <QuestionAnswerSection control={control} />
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
    btnSave: {
      marginRight: spacing.margin.small,
    },
  });
};

export default EntryQuiz;
