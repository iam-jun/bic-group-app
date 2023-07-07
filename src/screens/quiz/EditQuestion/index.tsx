import React, { FC } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FormProvider, useFieldArray } from 'react-hook-form';
import useQuizzesStore from '~/store/entities/quizzes';
import Header from '~/beinComponents/Header';
import { useBaseHook } from '~/hooks';
import useEditQuestion from './hooks/useEditQuestion';
import { spacing } from '~/theme';
import QuestionField from './components/QuestionField';
import AnswerField from './components/AnswerField';
import { useBackPressListener } from '~/hooks/navigation';

type EditQuestionProps = {
  route?: {
    params?: {
      questionIndex: number;
      contentId: string;
    };
  };
};

const EditQuestion: FC<EditQuestionProps> = (props) => {
  const { route } = props;
  const { params } = route || {};
  const { questionIndex, contentId } = params || {};

  const loading = useQuizzesStore((state) => state.loading);
  const quiz = useQuizzesStore((state) => state.data[contentId]);

  const {
    methods, hasQuestion, enabledBtnSave, onSave, onRemoveQuestion, handleBack,
  } = useEditQuestion(
    quiz,
    questionIndex,
  );

  const { control } = methods || {};

  const { fields, remove } = useFieldArray({
    control,
    name: 'answers',
  });

  const { t } = useBaseHook();
  const theme = useTheme();
  const styles = createStyle(theme);

  useBackPressListener(handleBack);

  return (
    <View style={styles.container}>
      <Header
        useI18n
        title={t('quiz:edit_the_question_number', {
          number: questionIndex + 1,
        })}
        buttonProps={{
          disabled: !enabledBtnSave,
          loading,
          style: styles.btnSave,
        }}
        buttonText="common:btn_save"
        onPressButton={onSave}
        onPressBack={handleBack}
      />
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        alwaysBounceVertical={false}
      >
        {hasQuestion && (
          <FormProvider {...methods}>
            <QuestionField remove={onRemoveQuestion} questionIndex={questionIndex} />
            {fields.map((field, index) => (
              <AnswerField key={`answer_field.${field.id}`} remove={remove} answerIndex={index} />
            ))}
          </FormProvider>
        )}
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
  });
};

export default EditQuestion;
