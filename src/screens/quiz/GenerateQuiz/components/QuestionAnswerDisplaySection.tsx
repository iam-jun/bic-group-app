import React, { FC, useEffect } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import {
  Control, Controller, UseFormTrigger, UseFormWatch,
} from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { isEmpty } from 'lodash';
import { FormGenerateQuiz } from '../hooks/useGenerateQuiz';
import { TextInput } from '~/baseComponents/Input';
import { useBaseHook } from '~/hooks';
import { spacing } from '~/theme';
import Text from '~/baseComponents/Text';
import { MAX_ANSWERS, MAX_QUESTIONS } from './QuestionAnswerSection';
import ViewSpacing from '~/beinComponents/ViewSpacing';

type QuestionAnswerDisplaySectionProps = {
    control: Control<FormGenerateQuiz>;
    watch: UseFormWatch<FormGenerateQuiz>;
    trigger: UseFormTrigger<FormGenerateQuiz>
}

const QuestionAnswerDisplaySection: FC<QuestionAnswerDisplaySectionProps> = ({ control, watch, trigger }) => {
  const { t } = useBaseHook();
  const theme = useTheme();
  const styles = createStyle(theme);

  const question = watch('question');
  const answer = watch('answer');

  useEffect(() => {
    // revalidate
    trigger('questionDisplay');
  }, [question]);

  useEffect(() => {
    // revalidate
    trigger('answerDisplay');
  }, [answer]);

  const renderInputQuestion = ({ field: { onChange, value }, fieldState: { error } }: any) => (
    <TextInput
      testID="question_answer_display_section.question"
      label={t('quiz:input_title_number_question')}
      value={value}
      placeholder={t('quiz:input_number_question_placeholder', { max: MAX_QUESTIONS })}
      onChangeText={onChange}
      error={!!error && !!error.message}
      helperText={!!error && error.message}
      keyboardType="number-pad"
    />
  );

  const renderInputAnswer = ({ field: { onChange, value }, fieldState: { error } }: any) => (
    <TextInput
      testID="question_answer_display_section.answer"
      label={t('quiz:input_title_number_answer')}
      value={value}
      placeholder={t('quiz:input_number_answer_placeholder', { max: MAX_ANSWERS })}
      onChangeText={onChange}
      error={!!error && !!error.message}
      helperText={!!error && error.message}
      keyboardType="number-pad"
    />
  );

  const validateInputQuestion = {
    greaterThan0: (value) => isEmpty(value) || (!isEmpty(value) && Number(value) > 0) || t('quiz:the_question_must_be_greater_than_0'),
    lessThan: (value) => Number(value) <= Number(question) || t('quiz:cannot_exceed_the_number_of_questions_above'),
  };

  const validateInputAnswer = {
    greaterThan0: (value) => isEmpty(value) || (!isEmpty(value) && Number(value) > 0) || t('quiz:the_answers_must_be_greater_than_0'),
    lessThan: (value) => Number(value) <= Number(answer) || t('quiz:cannot_exceed_the_number_of_answers_above'),
  };

  return (
    <View style={styles.container}>
      <Text.ParagraphL useI18n style={styles.textTitle}>quiz:title_describe_question_answer_display</Text.ParagraphL>
      <Controller
        name="questionDisplay"
        control={control}
        rules={{ required: false, validate: validateInputQuestion }}
        render={renderInputQuestion}
      />
      <Controller
        name="answerDisplay"
        control={control}
        rules={{ required: false, validate: validateInputAnswer }}
        render={renderInputAnswer}
      />
      <ViewSpacing height={spacing.margin.large} />
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
      marginVertical: spacing.margin.large,
    },
  });
};

export default QuestionAnswerDisplaySection;
