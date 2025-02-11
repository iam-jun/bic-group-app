/* eslint-disable unused-imports/no-unused-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useEffect } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import {
  Control,
  Controller,
  UseFormTrigger,
  UseFormWatch,
} from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { isEmpty, isNumber } from 'lodash';
import { TextInput } from '~/baseComponents/Input';
import { useBaseHook } from '~/hooks';
import { spacing } from '~/theme';
import Text from '~/baseComponents/Text';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { FormGenerateQuiz } from '~/interfaces/IQuiz';
import { MAX_QUESTIONS, MAX_ANSWERS, validateIntegerNumber } from '../../helper';
import useQuizzesStore from '~/store/entities/quizzes';

type QuestionAnswerDisplaySectionProps = {
  control: Control<FormGenerateQuiz>;
  watch: UseFormWatch<FormGenerateQuiz>;
  trigger: UseFormTrigger<FormGenerateQuiz>;
  questionsLength: number;
};

const QuestionAnswerDisplaySection: FC<QuestionAnswerDisplaySectionProps> = ({
  control,
  watch,
  trigger,
  questionsLength,
}) => {
  const { t } = useBaseHook();
  const theme = useTheme();
  const styles = createStyle(theme);

  const quizzesStoreActions = useQuizzesStore((state) => state.actions);

  // const question = watch('numberOfQuestions');
  // const answer = watch('numberOfAnswers');

  // useEffect(() => {
  //   // revalidate
  //   trigger('numberOfQuestionsDisplay');
  // }, [question]);

  // useEffect(() => {
  //   // revalidate
  //   trigger('numberOfAnswersDisplay');
  // }, [answer]);

  const renderInputQuestion = ({
    field: { onChange, value },
    fieldState: { error },
  }: any) => (
    <TextInput
      testID="question_answer_display_section.question"
      label={t('quiz:input_title_number_question')}
      isShowTextOptional
      value={value}
      placeholder={t('quiz:input_number_question_placeholder', {
        max: MAX_QUESTIONS,
      })}
      onChangeText={(text) => {
        quizzesStoreActions.setFormGenerateQuiz({
          numberOfQuestionsDisplay: text,
        });
        onChange(text);
      }}
      error={!!error && !!error.message}
      helperText={!!error && error.message}
      keyboardType="number-pad"
    />
  );

  // const renderInputAnswer = ({ field: { onChange, value }, fieldState: { error } }: any) => (
  //   <TextInput
  //     testID="question_answer_display_section.answer"
  //     label={t('quiz:input_title_number_answer')}
  //     value={value}
  //     placeholder={t('quiz:input_number_answer_placeholder', { max: MAX_ANSWERS })}
  //     onChangeText={onChange}
  //     error={!!error && !!error.message}
  //     helperText={!!error && error.message}
  //     keyboardType="number-pad"
  //   />
  // );

  const validateInputQuestion = {
    validateIntegerNumber,
    greaterThan0: (value) => isEmpty(value)
      || (!isEmpty(value) && Number(value) > 0)
      || t('quiz:the_question_must_be_greater_than_0'),
    lessThan: (value) => Number(value) <= questionsLength
      || t('quiz:cannot_exceed_the_number_of_questions_above'),
  };

  // const validateInputAnswer = {
  //   greaterThan0: (value) => isEmpty(value)
  //     || (!isEmpty(value) && Number(value) > 0)
  //     || t('quiz:the_answers_must_be_greater_than_0'),
  //   lessThan: (value) => Number(value) <= Number(answer)
  //     || t('quiz:cannot_exceed_the_number_of_answers_above'),
  // };

  return (
    <View style={styles.container}>
      <ViewSpacing height={spacing.margin.large} />
      <Controller
        name="numberOfQuestionsDisplay"
        control={control}
        rules={{ required: false, validate: validateInputQuestion }}
        render={renderInputQuestion}
      />
      <Text.BodyS useI18n style={styles.textTitle}>
        quiz:title_describe_question_display
      </Text.BodyS>
      {/* <Controller
        name="numberOfAnswersDisplay"
        control={control}
        rules={{ required: false, validate: validateInputAnswer }}
        render={renderInputAnswer}
      /> */}
      <ViewSpacing height={spacing.margin.extraLarge} />
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      borderTopWidth: 1,
      borderTopColor: colors.neutral5,
    },
    btnSave: {
      marginRight: spacing.margin.small,
    },
    containerInputDescription: {
      paddingHorizontal: 0,
    },
    textTitle: {
      marginTop: spacing.margin.xSmall,
    },
  });
};

export default QuestionAnswerDisplaySection;
