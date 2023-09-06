import React, { FC, useState } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { Platform, StyleSheet, View } from 'react-native';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { ComposeQuestionForm } from '~/interfaces/IQuiz';
import Text from '~/baseComponents/Text';
import { TextArea } from '~/baseComponents/Input';
import { useBaseHook } from '~/hooks';
import { spacing } from '~/theme';
import { Button } from '~/baseComponents';
import Icon from '~/baseComponents/Icon';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { mapIndexToAlphabet, validateSpaceTrap } from '../../helper';

type AnswerFieldProps = {
  answerIndex: number;
  remove: (index?: number | number[]) => void;
  onLayoutAnswerView: (indexInputAnswer: number, y: number) => void;
};

const AnswerField: FC<AnswerFieldProps> = ({ answerIndex, remove, onLayoutAnswerView }) => {
  const { t } = useBaseHook();
  const theme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const [isShowCountLength, setIsShowCountLength] = useState(false);

  const { control, setValue } = useFormContext<ComposeQuestionForm>();

  const answers = useWatch({
    name: 'answers',
    control,
  });
  const answerItem = answers[answerIndex];
  const { isCorrect } = answerItem || {};

  const disabledBtnDelete = isCorrect || answers.length === 1;

  const setCorrectAnswer = () => {
    answers.forEach((_ans, index) => {
      setValue(`answers.${index}.isCorrect`, index === answerIndex, {
        shouldDirty: true,
      });
    });
  };

  const removeField = () => {
    remove(answerIndex);
  };

  const onInputFocus = () => {
    setIsShowCountLength(true);
  };

  const onInputBlur = () => {
    setIsShowCountLength(false);
  };

  const renderTextInput = ({ field: { onChange, value }, fieldState: { error } }: any) => (
    <TextArea
      testID="answer_field.answer"
      value={value}
      placeholder={t('quiz:enter_answer_placeholder')}
      onChangeText={onChange}
      showCountLength={isShowCountLength}
      style={styles.containerViewInput}
      inputStyle={[
        styles.inputStyle,
        Platform.OS === 'android' && { padding: 0 },
      ]}
      inputStyleContainer={styles.inputStyleContainer}
      errorText={!!error && error.message}
      onFocus={onInputFocus}
      onBlur={onInputBlur}
    />
  );

  const onLayout = (e) => {
    onLayoutAnswerView(answerIndex, e.nativeEvent?.layout?.y);
  };

  return (
    <View
      style={styles.container}
      onLayout={onLayout}
    >
      <ViewSpacing width={spacing.margin.small} />
      <View style={[styles.square, isCorrect && styles.squareAlphabetCorrect]}>
        <Text.ButtonS color={isCorrect ? colors.green50 : colors.neutral40}>
          {mapIndexToAlphabet[answerIndex]}
        </Text.ButtonS>
      </View>
      <View style={{ flex: 1 }}>
        <Controller
          name={`answers.${answerIndex}.content`}
          control={control}
          rules={{ required: t('quiz:this_field_must_not_be_empty'), validate: validateSpaceTrap }}
          render={renderTextInput}
        />
      </View>
      <Button
        testID={`answer_field.btn_check_${answerIndex}`}
        onPress={setCorrectAnswer}
        style={[styles.square, isCorrect && styles.squareCheckCorrect]}
      >
        <Icon
          size={16}
          tintColor={isCorrect ? colors.white : colors.neutral40}
          icon="Check"
        />
      </Button>
      <ViewSpacing width={spacing.margin.xSmall} />
      <Button
        testID={`answer_field.btn_remove_${answerIndex}`}
        style={styles.square}
        disabled={disabledBtnDelete}
        onPress={removeField}
      >
        <Icon
          size={16}
          tintColor={disabledBtnDelete ? colors.neutral20 : colors.neutral40}
          icon="Xmark"
        />
      </Button>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.margin.small,
    },
    inputStyle: {
      flex: 0,
      maxHeight: 84,
    },
    inputStyleContainer: {
      minHeight: 0,
      marginBottom: 0,
    },
    containerViewInput: {
      paddingVertical: 0,
      paddingHorizontal: spacing.padding.xSmall,
    },
    square: {
      height: 28,
      width: 28,
      borderRadius: spacing.borderRadius.base,
      justifyContent: 'center',
      alignItems: 'center',
    },
    squareAlphabetCorrect: {
      backgroundColor: colors.green2,
      borderRadius: spacing.borderRadius.base,
    },
    squareCheckCorrect: {
      backgroundColor: colors.green50,
    },
  });
};

export default AnswerField;
