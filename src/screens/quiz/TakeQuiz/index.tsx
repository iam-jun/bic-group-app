import React, { useEffect } from 'react';
import {
  View, StyleSheet, ScrollView, Platform, ActivityIndicator,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import showAlert from '~/store/helper/showAlert';
import { useBaseHook } from '~/hooks';
import { useBackPressListener, useRootNavigation } from '~/hooks/navigation';
import Text from '~/baseComponents/Text';
import { Button } from '~/baseComponents';
import { spacing } from '~/theme';
import AnswerItem from './components/AnswerItem';
import useTakeQuiz from './hooks/useTakeQuiz';
import { BUTTON_SIZES } from '~/baseComponents/Button/constants';

interface TakeQuizProps {
  route?: {
    params?: {
      quizId: string;
      contentId: string;
    };
  };
}

const BOTTOM_SPACE = Platform.OS === 'ios' ? 38 : 24;

const TakeQuiz: React.FC<TakeQuizProps> = (props) => {
  const { route } = props;
  const { quizId, contentId } = route.params || {};

  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);
  const { t } = useBaseHook();
  const { rootNavigation } = useRootNavigation();

  const {
    isPrepareTakingQuiz,
    onPressNextQuestion,
    onPressPreviousQuestion,
    enableButtonPrevious,
    currentQuestionIndex,
    currentQuestion,
    totalQuestion,
    questionChoosedAnswer,
    onPickAnswer,
    resetDataTakingQuiz,
  } = useTakeQuiz(quizId, contentId);

  const { content, answers } = currentQuestion || {};

  useEffect(() => () => resetDataTakingQuiz(), []);

  const goBack = () => rootNavigation.goBack();

  const onPressBack = () => {
    showAlert({
      title: t('quiz:alert_title_discard_quiz'),
      content: t('quiz:alert_content_discard_quiz'),
      cancelBtn: true,
      confirmLabel: t('quiz:btn_exit'),
      onConfirm: goBack,
    });
  };

  useBackPressListener(onPressBack);

  const rendeAnswerItem = (item, index) => {
    const isCorrect = questionChoosedAnswer?.answerId === item.id;

    return (
      <AnswerItem
        data={item}
        onPress={onPickAnswer}
        index={index}
        key={item.id}
        isCorrect={isCorrect}
      />
    );
  };

  const renderContent = () => {
    if (isPrepareTakingQuiz) return (
      <View style={styles.loadingView}>
        <ActivityIndicator color={colors.neutral30} size='large' />
      </View>
    );;

    return (
      <View style={styles.content}>
        <Text.SubtitleXS color={colors.neutral30}>
          {`QUESTION ${currentQuestionIndex + 1} OF ${totalQuestion}`}
        </Text.SubtitleXS>
        <View style={styles.questionContainer}>
          <Text.H4 color={colors.neutral60}>
            { content }
          </Text.H4>
        </View>
        {answers?.map(rendeAnswerItem)}
      </View>
    );
  }

  const renderButtons = () => {
    if (isPrepareTakingQuiz) return null;

    return (
      <>
        <Button.Primary
          size="large"
          useI18n
          onPress={onPressNextQuestion}
          style={styles.btnNext}
        >
          quiz:btn_next
        </Button.Primary>
        {enableButtonPrevious && (
          <Button
            onPress={onPressPreviousQuestion}
            style={styles.btnPrev}
          >
            <Text.ButtonM useI18n color={colors.neutral60}>
              quiz:btn_previous
            </Text.ButtonM>
          </Button>
        )}
      </>
    );
  };

  return (
    <ScreenWrapper isFullView backgroundColor={colors.white} testID="take_quiz">
      <Header
        titleTextProps={{ useI18n: true }}
        title="quiz:title_take_quiz"
        onPressBack={onPressBack}
      />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {renderContent()}
      </ScrollView>
      {renderButtons()}
    </ScreenWrapper>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    contentContainer: {
      flex: 1,
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.padding.large,
      paddingTop: spacing.padding.extraLarge,
    },
    questionContainer: {
      marginTop: spacing.margin.base,
      marginBottom: spacing.margin.large,
    },
    btnNext: {
      marginTop: spacing.margin.base,
      marginBottom: 20,
      marginHorizontal: spacing.margin.large,
    },
    btnPrev: {
      marginBottom: BOTTOM_SPACE,
      marginHorizontal: spacing.margin.large,
      borderWidth: 1,
      borderColor: colors.neutral20,
      borderRadius: spacing.borderRadius.large,
      height: BUTTON_SIZES.large,
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

export default TakeQuiz;
