import React, { FC, useRef } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FormProvider, useFieldArray } from 'react-hook-form';
import { isNumber } from 'lodash';
import useQuizzesStore from '~/store/entities/quizzes';
import Header from '~/beinComponents/Header';
import { useBaseHook } from '~/hooks';
import useComposeQuestion, {
  ValidateComposeQuestionError,
} from './hooks/useComposeQuestion';
import { spacing } from '~/theme';
import QuestionField from './components/QuestionField';
import AnswerField from './components/AnswerField';
import { useBackPressListener } from '~/hooks/navigation';
import { MAX_ANSWERS } from '../helper';
import { Button } from '~/baseComponents';
import Icon from '~/baseComponents/Icon';
import Text from '~/baseComponents/Text';

type ComposeQuestionProps = {
  route?: {
    params?: {
      questionIndex?: number;
      quizId: string;
    };
  };
};

const ComposeQuestion: FC<ComposeQuestionProps> = (props) => {
  const { route } = props;
  const { params } = route || {};
  const { questionIndex, quizId } = params || {};
  const isCreatingQuestion = !isNumber(questionIndex);

  const scrollViewRef = useRef<any>();

  const loading = useQuizzesStore((state) => state.loading);
  const quiz = useQuizzesStore((state) => state.data[quizId]);
  const { questions = [] } = quiz || {};

  const {
    methods,
    enabledBtnSave,
    needToChooseCorrectAnswer,
    onSave,
    onRemoveQuestion,
    handleBack,
  } = useComposeQuestion(quiz, questionIndex);

  const { control } = methods || {};

  const { fields, remove, append } = useFieldArray({
    control,
    name: 'answers',
  });

  const { t } = useBaseHook();
  const theme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const inputsYPosition = useRef({});

  const onLayoutAnswerView = (indexInputAnswer: number, y: number) => {
    inputsYPosition.current[indexInputAnswer] = y;
  };

  const onPressAddAnswer = () => {
    append({
      content: '',
      isCorrect: false,
    });
  };

  const onValidateError: ValidateComposeQuestionError = (
    type: 'question' | 'answers',
    indexInputAnswer?: number,
  ) => {
    switch (type) {
      case 'question':
        // scroll to question field
        scrollViewRef?.current?.scrollToPosition?.(0, 0, true);
        break;
      case 'answers':
        if (isNumber(indexInputAnswer)) {
          // scroll to answer field
          scrollViewRef?.current?.scrollToPosition?.(
            0,
            inputsYPosition.current[indexInputAnswer],
            true,
          );
        } else {
          // scroll to end
          scrollViewRef?.current?.scrollToEnd?.(true);
        }
        break;
    }
  };

  useBackPressListener(handleBack);

  return (
    <View style={styles.container}>
      <Header
        useI18n
        title={
          isCreatingQuestion
            ? t('quiz:add_question')
            : t('quiz:edit_the_question_number', {
              number: questionIndex + 1,
            })
        }
        buttonProps={{
          disabled: !enabledBtnSave,
          loading,
          style: styles.btnSave,
        }}
        buttonText="common:btn_save"
        onPressButton={onSave(onValidateError)}
        onPressBack={handleBack}
      />
      <KeyboardAwareScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        alwaysBounceVertical={false}
        keyboardShouldPersistTaps="handled"
      >
        <FormProvider {...methods as any}>
          <QuestionField
            remove={onRemoveQuestion}
            questionIndex={
              isCreatingQuestion ? questions.length : questionIndex
            }
          />
          {fields.map((field, index) => (
            <AnswerField
              key={`answer_field.${field.id}`}
              remove={remove}
              answerIndex={index}
              onLayoutAnswerView={onLayoutAnswerView}
            />
          ))}
          {fields.length < MAX_ANSWERS && (
            <Button.Neutral
              type="ghost"
              icon="Plus"
              iconSize={16}
              useI18n
              style={styles.btnAddAnswer}
              onPress={onPressAddAnswer}
            >
              quiz:add_answer
            </Button.Neutral>
          )}
          {needToChooseCorrectAnswer && (
            <View style={styles.errorView}>
              <Icon
                icon="CircleExclamation"
                size={14}
                tintColor={colors.red40}
              />
              <Text.BodyXS style={styles.errorText} useI18n>
                quiz:please_select_correct_answer
              </Text.BodyXS>
            </View>
          )}
        </FormProvider>
      </KeyboardAwareScrollView>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    btnSave: {
      marginRight: spacing.margin.small,
    },
    scrollView: {
      flex: 1,
    },
    contentContainer: {
      padding: spacing.padding.large,
      paddingBottom: spacing.padding.large + 84,
    },
    btnAddAnswer: {
      alignSelf: 'baseline',
      marginTop: spacing.margin.small,
    },
    errorView: {
      flexDirection: 'row',
      flex: 1,
      marginTop: spacing.margin.small,
    },
    errorText: {
      color: colors.red40,
      marginLeft: spacing.margin.tiny,
    },
  });
};

export default ComposeQuestion;
