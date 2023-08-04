import React from 'react';
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
import QuestionComposeQuiz from '../ComposeQuiz/components/QuestionComposeQuiz';
import Text from '~/baseComponents/Text';
import { Button } from '~/baseComponents';
import { spacing } from '~/theme';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import showAlert from '~/store/helper/showAlert';
import useTakeQuiz from '../TakeQuiz/hooks/useTakeQuiz';
import useTakeQuizStore from '../TakeQuiz/store';

interface TakeQuizReviewProps {
  route?: {
    params?: {
      quizId?: string;
      participantId?: string;
      contentId?: string;
    };
  };
}

const BOTTOM_SPACE = Platform.OS === 'ios' ? 38 : 24;

const TakeQuizReview: React.FC<TakeQuizReviewProps> = ({ route }) => {
  const { quizId, participantId, contentId } = route.params || {};

  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const { t } = useBaseHook();
  const { rootNavigation } = useRootNavigation();
  const styles = createStyle(theme);

  const { participantResult } = useTakeQuizStore((state) => state);
  const { title, description } = participantResult[participantId] || {};
  const { onSubmit, questionReviews } = useTakeQuiz(quizId, contentId);

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
      quizId={quizId}
      questionItem={item}
      questionIndex={index}
      isTakeQuizReview
    />
  );

  const renderHeader = () => (
    <View style={styles.headerList}>
      <Text.SubtitleL color={colors.neutral80}>
        { title }
      </Text.SubtitleL>
      <ViewSpacing height={spacing.margin.small} />
      {!!description && (
        <Text.BodyM color={colors.neutral80}>
          { description }
        </Text.BodyM>
      )}
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
        data={questionReviews}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={renderHeader}
        ItemSeparatorComponent={renderItemSeparatorComponent}
        contentContainerStyle={styles.containerContent}
      />
      <Button.Primary
        testID="take_quiz_review.btn_submit"
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
