import React, { FC } from 'react';
import { Control, Controller } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { TextInput } from '~/baseComponents/Input';
import { useBaseHook } from '~/hooks';
import { spacing } from '~/theme';
import Text from '~/baseComponents/Text';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { FormGenerateQuiz } from '~/interfaces/IQuiz';
import { validateIntegerNumber } from '../../helper';

type QuestionAnswerSectionProps = {
    control: Control<FormGenerateQuiz>;
}

export const MAX_QUESTIONS = 50;
export const MAX_ANSWERS = 6;

const QuestionAnswerSection: FC<QuestionAnswerSectionProps> = ({ control }) => {
  const { t } = useBaseHook();
  const styles = createStyle();

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
    validateIntegerNumber,
    greaterThan0: (value) => Number(value) > 0 || t('quiz:the_question_must_be_greater_than_0'),
    lessThan: (value) => Number(value) <= MAX_QUESTIONS || t('quiz:number_of_questions_should_not_exceed', { max: MAX_QUESTIONS }),
  };

  const validateInputAnswer = {
    validateIntegerNumber,
    greaterThan0: (value) => Number(value) > 0 || t('quiz:the_answers_must_be_greater_than_0'),
    lessThan: (value) => Number(value) <= MAX_ANSWERS || t('quiz:number_of_answers_should_not_exceed', { max: MAX_ANSWERS }),
  };

  return (
    <View>
      <Text.ParagraphL useI18n style={styles.textTitle}>quiz:enter_number_of_questions_answers_quiz</Text.ParagraphL>
      <Controller
        name="numberOfQuestions"
        control={control}
        rules={{ required: t('quiz:question_is_required'), validate: validateInputQuestion }}
        render={renderInputQuestion}
      />
      <Controller
        name="numberOfAnswers"
        control={control}
        rules={{ required: t('quiz:answer_is_required'), validate: validateInputAnswer }}
        render={renderInputAnswer}
      />
      <ViewSpacing height={spacing.margin.large} />
    </View>
  );
};

const createStyle = () => StyleSheet.create({
  btnSave: {
    marginRight: spacing.margin.small,
  },
  containerInputDescription: {
    paddingHorizontal: 0,
  },
  textTitle: {
    marginBottom: spacing.margin.large,
  },
});

export default QuestionAnswerSection;
