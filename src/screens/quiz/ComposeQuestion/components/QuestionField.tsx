import React, { FC, useState } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { Platform, StyleSheet, View } from 'react-native';
import { Controller, useFormContext } from 'react-hook-form';
import { ComposeQuestionForm } from '~/interfaces/IQuiz';
import Text from '~/baseComponents/Text';
import { TextArea } from '~/baseComponents/Input';
import { useBaseHook } from '~/hooks';
import { spacing } from '~/theme';
import { Button } from '~/baseComponents';
import Icon from '~/baseComponents/Icon';
import { validateSpaceTrap } from '../../helper';

type QuestionFieldProps = {
  remove: () => void;
  questionIndex: number;
};

const QuestionField: FC<QuestionFieldProps> = ({ remove, questionIndex }) => {
  const { t } = useBaseHook();
  const theme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const [isShowCountLength, setIsShowCountLength] = useState(false);

  const { control } = useFormContext<ComposeQuestionForm>();

  const onInputFocus = () => {
    setIsShowCountLength(true);
  };

  const onInputBlur = () => {
    setIsShowCountLength(false);
  };

  const renderTextInput = ({ field: { onChange, value }, fieldState: { error } }: any) => (
    <TextArea
      testID="question_field.question"
      value={value}
      placeholder={t('quiz:enter_question_placeholder')}
      onChangeText={onChange}
      showCountLength={isShowCountLength}
      style={styles.containerViewInput}
      inputStyle={[styles.inputStyle, Platform.OS === 'android' && { padding: 0 }]}
      inputStyleContainer={styles.inputStyleContainer}
      errorText={!!error && error.message}
      onFocus={onInputFocus}
      onBlur={onInputBlur}
    />
  );

  return (
    <View style={styles.container}>
      <Text.LabelM color={colors.neutral40}>{`${questionIndex + 1}.`}</Text.LabelM>
      <View style={{ flex: 1 }}>
        <Controller
          name="content"
          control={control}
          rules={{ required: t('quiz:this_field_must_not_be_empty'), validate: validateSpaceTrap }}
          render={renderTextInput}
        />
      </View>
      <Button testID="question_field.btn_remove" style={styles.square} onPress={remove}>
        <Icon size={16} tintColor={colors.neutral40} icon="Xmark" />
      </Button>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
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
  });
};

export default QuestionField;
