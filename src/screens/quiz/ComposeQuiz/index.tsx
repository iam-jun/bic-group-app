import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC, useEffect } from 'react';
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
  EditQuizActionsParams,
  GenerateQuizParams,
  QuestionItem,
  QuizStatus,
} from '~/interfaces/IQuiz';
import useQuizzesStore from '~/store/entities/quizzes';
import { useRootNavigation } from '~/hooks/navigation';
import QuestionComposeQuiz from './components/QuestionComposeQuiz';
import showToast from '~/store/helper/showToast';
import postsSelector from '~/store/entities/posts/selectors';
import usePostsStore from '~/store/entities/posts';

type ComposeQuizProps = {
  route?: {
    params?: GenerateQuizParams;
  };
};

const ComposeQuiz: FC<ComposeQuizProps> = (props) => {
  const { route } = props;
  const { params } = route || {};
  const { contentId } = params || {};

  const { rootNavigation } = useRootNavigation();

  const theme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const post = usePostsStore(postsSelector.getPost(contentId, {}));
  const { audience } = post;
  const { groups = [] } = audience || {};

  const isGenerating = useQuizzesStore((state) => state.isGenerating);
  const loading = useQuizzesStore((state) => state.loading);
  const quiz = useQuizzesStore((state) => state.data[contentId]);

  const actionsQuizzesStore = useQuizzesStore((state) => state.actions);

  const {
    questions = [], id,
  } = quiz || {};

  const disabledBtnSave = isGenerating || loading || isEmpty(quiz);

  const generateQuiz = () => {
    if (!id) {
      const paramsGenerateQuiz: GenerateQuizParams = {
        ...params,
        isRandom: true,
      };
      actionsQuizzesStore.generateQuiz(paramsGenerateQuiz);
    } else {
      actionsQuizzesStore.regenerateQuiz(id);
    }
  };

  useEffect(() => {
    generateQuiz();
  }, []);

  const renderItem: ListRenderItem<QuestionItem> = ({ item, index }) => (
    <QuestionComposeQuiz contentId={contentId} questionItem={item} index={index} />
  );

  const keyExtractor = (question) => `question_${question.id}`;

  const renderItemSeparatorComponent = () => (
    <View style={styles.line} />
  );

  const onPressBack = () => {
    if (id) {
      actionsQuizzesStore.removeQuiz(contentId);
    }
    rootNavigation.goBack();
  };

  const onSave = () => {
    const onSuccess = () => {
      showToast({ content: 'quiz:successfully_created_a_quiz' });
      rootNavigation.pop(2);
      // temporarily for task create quiz
      actionsQuizzesStore.removeQuiz(contentId);
    };
    const editQuizActionsParams: EditQuizActionsParams = {
      idQuiz: id,
      params: {
        status: QuizStatus.PUBLISHED,
      },
      audiences: groups,
      onSuccess,
    };
    actionsQuizzesStore.editQuiz(editQuizActionsParams);
  };

  return (
    <View style={styles.container}>
      <Header
        useI18n
        title="quiz:quiz_review"
        buttonProps={{
          disabled: disabledBtnSave,
          loading,
          style: styles.btnSave,
        }}
        buttonText="common:btn_create"
        onPressButton={onSave}
        onPressBack={onPressBack}
      />
      {isGenerating && (
        <View style={styles.containerLoadingView}>
          <ActivityIndicator color={colors.gray20} />
        </View>
      )}
      {!isGenerating && questions.length !== 0 && (
        <FlatList
          data={questions}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={styles.containerContent}
          ItemSeparatorComponent={renderItemSeparatorComponent}
        />
      )}
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
    btnSave: {
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
