import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC, useEffect, useLayoutEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { isEmpty } from 'lodash';
import Header from '~/beinComponents/Header';
import { spacing } from '~/theme';
import {
  GenStatus,
  QuestionItem,
} from '~/interfaces/IQuiz';
import useQuizzesStore from '~/store/entities/quizzes';
import { useRootNavigation } from '~/hooks/navigation';
import QuestionComposeQuiz from './components/QuestionComposeQuiz';
import GeneratingQuiz from './components/GeneratingQuiz';
import GeneratingQuizFailed from './components/GeneratingQuizFailed';
import quizStack from '~/router/navigator/MainStack/stacks/quizStack/stack';
import showToast from '~/store/helper/showToast';
import { useBaseHook } from '~/hooks';
import menuStack from '~/router/navigator/MainStack/stacks/menuStack/stack';
import usePostsStore from '~/store/entities/posts';

type ComposeQuizProps = {
  route?: {
    params?: {
      quizId: string;
    };
  };
};

const ComposeQuiz: FC<ComposeQuizProps> = (props) => {
  const { route } = props;
  const { params } = route || {};
  const { quizId } = params || {};

  const { t } = useBaseHook();
  const { rootNavigation } = useRootNavigation();

  const theme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const isGenerating = useQuizzesStore((state) => state.isGenerating);
  const isGettingQuizDetail = useQuizzesStore((state) => state.isGettingQuizDetail);
  const quiz = useQuizzesStore((state) => state.data[quizId]);

  const actionsQuizzesStore = useQuizzesStore((state) => state.actions);
  const actionsPostsStore = usePostsStore((state) => state.actions);

  const {
    questions = [], id, genStatus, contentId,
  } = quiz || {};

  const disabledBtnNext = questions.length === 0;
  const isShowGenerating = isGenerating || [GenStatus.PENDING, GenStatus.PROCESSING].includes(genStatus);
  const isShowGeneratingFailed = genStatus === GenStatus.FAILED;

  const onNext = () => {
    rootNavigation.navigate(quizStack.publishQuiz, { quizId });
  };

  const btnNext = !isGettingQuizDetail && !isShowGenerating && !isShowGeneratingFailed && !isEmpty(quiz) && {
    buttonProps: {
      disabled: disabledBtnNext,
      loading: false,
      style: styles.btnNext,
    },
    buttonText: 'common:btn_next',
    onPressButton: onNext,
  };

  useLayoutEffect(() => {
    // clear quiz for refetching quiz
    actionsQuizzesStore.removeQuizLocal(id);
  }, []);

  useEffect(() => {
    // refetching quiz
    actionsQuizzesStore.getQuizDetail({ quizId });
    // set waitingProcessingQuiz for handling socket
    // see handleQuizNotificationSocket in src/screens/quiz/helper.ts
    actionsQuizzesStore.setWaitingProcessingQuiz(quizId);

    return () => {
      // remove waitingProcessingQuiz when leaving
      actionsQuizzesStore.setWaitingProcessingQuiz(null);
    };
  }, []);

  const renderItem: ListRenderItem<QuestionItem> = ({ item, index }) => (
    <QuestionComposeQuiz quizId={id} questionItem={item} questionIndex={index} />
  );

  const keyExtractor = (question) => `question_${question.id}`;

  const renderItemSeparatorComponent = () => (
    <View style={styles.line} />
  );

  const onPressDraft = () => {
    rootNavigation.navigate(menuStack.yourContent, { initTab: 4 });
  };

  const onPressBack = () => {
    if (isShowGenerating) {
      showToast({
        content: 'quiz:quiz_saved_to_draft',
        buttonText: t('quiz:draft_quiz'),
        onButtonPress: onPressDraft,
      });
    }
    actionsPostsStore.getPostDetail({ postId: contentId });
    rootNavigation.goBack();
  };

  const renderLoadingQuizDetail = () => (
    <View style={styles.containerLoadingView}>
      <ActivityIndicator color={colors.gray20} />
    </View>
  );

  const onPressRegenerate = () => {
    actionsQuizzesStore.regenerateQuiz(id);
  };

  const renderContent = () => {
    if (isGettingQuizDetail) {
      return renderLoadingQuizDetail();
    }

    if (isEmpty(quiz)) {
      return null;
    }

    if (isShowGenerating) {
      return <GeneratingQuiz />;
    }

    if (isShowGeneratingFailed) {
      return <GeneratingQuizFailed onPressRegenerate={onPressRegenerate} />;
    }

    if (!isGenerating && questions.length !== 0) {
      return (
        <FlatList
          data={questions}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={styles.containerContent}
          ItemSeparatorComponent={renderItemSeparatorComponent}
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      <Header
        useI18n
        title="quiz:quiz_review"
        onPressBack={onPressBack}
        {...btnNext}
      />
      {renderContent()}
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
      paddingBottom: spacing.padding.large + insets.bottom,
    },
    btnNext: {
      marginRight: spacing.margin.small,
    },
    btnRegenerateQuiz: {
      marginRight: spacing.margin.large,
    },
    containerLoadingView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    line: {
      borderTopColor: colors.neutral5,
      borderTopWidth: 1,
    },
  });
};

export default ComposeQuiz;
