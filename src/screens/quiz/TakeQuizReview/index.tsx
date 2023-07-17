import React, { useEffect } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import {
  View, StyleSheet, FlatList, ListRenderItem, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import { useBackPressListener, useRootNavigation } from '~/hooks/navigation';
import { useBaseHook } from '~/hooks';
import { QuestionItem } from '~/interfaces/IQuiz';
import useQuizzesStore from '~/store/entities/quizzes';
import QuestionComposeQuiz from '../ComposeQuiz/components/QuestionComposeQuiz';
import Text from '~/baseComponents/Text';
import { Button } from '~/baseComponents';
import { spacing } from '~/theme';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import showAlert from '~/store/helper/showAlert';
import quizStack from '~/router/navigator/MainStack/stacks/quizStack/stack';

interface TakeQuizReviewProps {}

const BOTTOM_SPACE = Platform.OS === 'ios' ? 38 : 24;

const fakeId = 'f400562d-5ee9-4a14-abb2-80f4f0e81fff';

const TakeQuizReview: React.FC<TakeQuizReviewProps> = () => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const { t } = useBaseHook();
  const { rootNavigation } = useRootNavigation();
  const styles = createStyle(theme);
  // temporary use for UI
  const actionsQuizzesStore = useQuizzesStore((state) => state.actions);
  const quiz = useQuizzesStore((state) => state.data[fakeId]);
  const { questions = [] } = quiz || {};

  // temporary use for UI
  useEffect(() => {
    actionsQuizzesStore.getQuizDetail({ quizId: fakeId });
  }, []);

  const goBack = () => {
    rootNavigation.goBack();
  };

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

  const onSubmit = () => {
    rootNavigation.navigate(quizStack.takeQuizResult);
  };

  const onPressSubmit = () => {
    showAlert({
      title: t('common:btn_submit'),
      content: t('quiz:alert_content_submit_quiz'),
      cancelBtn: true,
      confirmLabel: t('common:btn_submit'),
      onConfirm: onSubmit,
    });
  };

  const renderItem: ListRenderItem<QuestionItem> = ({ item, index }) => (
    <QuestionComposeQuiz
      quizId={fakeId}
      questionItem={item}
      questionIndex={index}
      isTakeQuizReview
    />
  );

  const renderHeader = () => (
    <View style={styles.headerList}>
      <Text.SubtitleL color={colors.neutral80}>
        Taking part in a quiz for a reward
      </Text.SubtitleL>
      <ViewSpacing height={spacing.margin.small} />
      <Text.BodyM color={colors.neutral80}>
        Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat mollit non deserunt ullamco est sit aliqua dolor duis.
      </Text.BodyM>
      <ViewSpacing height={spacing.margin.large} />
      {renderItemSeparatorComponent()}
    </View>
  );

  const keyExtractor = (question) => `question_${question.id}`;

  const renderItemSeparatorComponent = () => <View style={styles.line} />;

  return (
    <ScreenWrapper isFullView backgroundColor={colors.white} testID="take_quiz_review">
      <Header
        titleTextProps={{ useI18n: true }}
        title="quiz:title_quiz_review"
        onPressBack={onPressBack}
      />
      <FlatList
        data={questions}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={renderHeader}
        ItemSeparatorComponent={renderItemSeparatorComponent}
        contentContainerStyle={styles.containerContent}
      />
      <Button.Primary
        size="large"
        useI18n
        onPress={onPressSubmit}
        style={styles.btnSubmit}
      >
        common:btn_submit
      </Button.Primary>
    </ScreenWrapper>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  const insets = useSafeAreaInsets();

  return StyleSheet.create({
    containerContent: {
      paddingHorizontal: spacing.padding.large,
      paddingBottom: spacing.padding.large + insets.bottom,
    },
    line: {
      borderTopColor: colors.neutral5,
      borderTopWidth: 1,
    },
    btnSubmit: {
      marginTop: spacing.margin.base,
      marginBottom: BOTTOM_SPACE,
      marginHorizontal: spacing.margin.large,
    },
    headerList: {
      paddingTop: spacing.padding.large,
      marginBottom: -spacing.padding.base,
    },
  });
};

export default TakeQuizReview;
