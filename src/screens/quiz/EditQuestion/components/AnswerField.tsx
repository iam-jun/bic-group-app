import React, { FC } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { Platform, StyleSheet, View } from 'react-native';
import {
  Controller, useFormContext, useWatch,
} from 'react-hook-form';
import { EditQuestionForm } from '~/interfaces/IQuiz';
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
};

const AnswerField: FC<AnswerFieldProps> = ({ answerIndex, remove }) => {
  const { t } = useBaseHook();
  const theme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const { control, setValue } = useFormContext<EditQuestionForm>();

  const answers = useWatch({
    name: 'answers',
    control,
  });
  const answerItem = answers[answerIndex];
  const { isCorrect } = answerItem || {};

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

  const renderTextInput = ({ field: { onChange, value } }: any) => (
    <TextArea
      testID="answer_field.answer"
      value={value}
      placeholder={t('quiz:enter_answer_placeholder')}
      onChangeText={onChange}
      showCountLength={false}
      style={styles.containerViewInput}
      inputStyle={[styles.inputStyle, Platform.OS === 'android' && { padding: 0 }]}
      inputStyleContainer={styles.inputStyleContainer}
    />
  );

  return (
    <View style={styles.container}>
      <ViewSpacing width={spacing.margin.small} />
      <View style={[styles.square, isCorrect && styles.squareAlphabetCorrect]}>
        <Text.ButtonS color={isCorrect ? colors.green50 : colors.neutral40}>
          {mapIndexToAlphabet[answerIndex]}
        </Text.ButtonS>
      </View>
      <View style={{ flex: 1 }}>
        <Controller
          name={`answers.${answerIndex}.answer`}
          control={control}
          rules={{ required: true, validate: validateSpaceTrap }}
          render={renderTextInput}
        />
      </View>
      <Button onPress={setCorrectAnswer} style={[styles.square, isCorrect && styles.squareCheckCorrect]}>
        <Icon size={16} tintColor={isCorrect ? colors.white : colors.neutral40} icon="Check" />
      </Button>
      <ViewSpacing width={spacing.margin.xSmall} />
      <Button style={styles.square} disabled={isCorrect} onPress={removeField}>
        <Icon size={16} tintColor={isCorrect ? colors.neutral20 : colors.neutral40} icon="Xmark" />
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
    },
    squareCheckCorrect: {
      backgroundColor: colors.green50,
    },
  });
};

export default AnswerField;
