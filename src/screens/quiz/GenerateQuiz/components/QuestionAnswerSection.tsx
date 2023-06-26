import React, { FC } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { Control, Controller } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { FormGenerateQuiz } from '../hooks/useGenerateQuiz';
import { TextInput } from '~/baseComponents/Input';
import { useBaseHook } from '~/hooks';
import { spacing } from '~/theme';
import Text from '~/baseComponents/Text';
import ViewSpacing from '~/beinComponents/ViewSpacing';

type QuestionAnswerSectionProps = {
    control: Control<FormGenerateQuiz>;
}

export const MAX_QUESTIONS = 50;
export const MAX_ANSWERS = 6;

const QuestionAnswerSection: FC<QuestionAnswerSectionProps> = ({ control }) => {
  const { t } = useBaseHook();
  const theme = useTheme();
  const styles = createStyle(theme);

  const renderInputQuestion = ({ field: { onChange, value }, fieldState: { error } }: any) => (
    <TextInput
      testID="question_answer_section.question"
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
      testID="question_answer_section.answer"
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
    greaterThan0: (value) => Number(value) > 0 || t('quiz:the_question_must_be_greater_than_0'),
    lessThan: (value) => Number(value) <= MAX_QUESTIONS || t('quiz:number_of_questions_should_not_exceed', { max: MAX_QUESTIONS }),
  };

  const validateInputAnswer = {
    greaterThan0: (value) => Number(value) > 0 || t('quiz:the_answers_must_be_greater_than_0'),
    lessThan: (value) => Number(value) <= MAX_ANSWERS || t('quiz:number_of_answers_should_not_exceed', { max: MAX_ANSWERS }),
  };

  return (
    <View style={styles.container}>
      <Text.ParagraphL useI18n style={styles.textTitle}>quiz:enter_number_of_questions_answers_quiz</Text.ParagraphL>
      <Controller
        name="question"
        control={control}
        rules={{ required: t('quiz:question_is_required'), validate: validateInputQuestion }}
        render={renderInputQuestion}
      />
      <Controller
        name="answer"
        control={control}
        rules={{ required: t('quiz:answer_is_required'), validate: validateInputAnswer }}
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

export default QuestionAnswerSection;
