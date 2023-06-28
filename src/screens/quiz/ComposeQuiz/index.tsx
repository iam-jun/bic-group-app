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
import { Button } from '~/baseComponents';
import useQuizzesStore from '~/store/entities/quizzes';
import Icon from '~/baseComponents/Icon';
import { useRootNavigation } from '~/hooks/navigation';
import TitleDescriptionComposeQuiz from './components/TitleDescriptionComposeQuiz';
import QuestionComposeQuiz from './components/QuestionComposeQuiz';
import showToast from '~/store/helper/showToast';

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

  const isGenerating = useQuizzesStore((state) => state.isGenerating);
  const loading = useQuizzesStore((state) => state.loading);
  const quiz = useQuizzesStore((state) => state.data[contentId]);

  const actionsQuizzesStore = useQuizzesStore((state) => state.actions);

  const {
    questions = [], id, title, description,
  } = quiz || {};

  const disabledBtnRegenerate = isGenerating || loading;
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

  const renderCustomComponent = () => (
    <View style={styles.btnRegenerateQuiz}>
      <Button disabled={disabledBtnRegenerate} onPress={generateQuiz}>
        <Icon icon="RotateSolid" size={18} tintColor={colors.neutral80} />
      </Button>
    </View>
  );

  const renderItem: ListRenderItem<QuestionItem> = ({ item, index }) => (
    <QuestionComposeQuiz questionItem={item} index={index} />
  );

  const keyExtractor = (_, index) => `question_${index}`;

  const renderListHeaderComponent = () => (
    <TitleDescriptionComposeQuiz title={title} description={description} />
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
      onSuccess,
    };
    actionsQuizzesStore.editQuiz(editQuizActionsParams);
  };

  return (
    <View style={styles.container}>
      <Header
        useI18n
        title="quiz:the_question"
        buttonProps={{
          disabled: disabledBtnSave,
          loading,
          style: styles.btnSave,
        }}
        buttonText="common:btn_create"
        onPressButton={onSave}
        onPressBack={onPressBack}
        renderCustomComponent={renderCustomComponent}
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
          ListHeaderComponent={renderListHeaderComponent}
          contentContainerStyle={styles.containerContent}
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
      paddingTop: spacing.padding.large,
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
  });
};

export default ComposeQuiz;
