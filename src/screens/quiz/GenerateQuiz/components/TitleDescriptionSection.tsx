import React, { FC } from 'react';
import { Control, Controller } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { FormGenerateQuiz } from '../hooks/useGenerateQuiz';
import { TextInput, TextArea } from '~/baseComponents/Input';
import { useBaseHook } from '~/hooks';
import { spacing } from '~/theme';

type TitleDescriptionSectionProps = {
  control: Control<FormGenerateQuiz>;
};

const TitleDescriptionSection: FC<TitleDescriptionSectionProps> = ({
  control,
}) => {
  const { t } = useBaseHook();
  const styles = createStyle();

  const renderInputTitle = ({
    field: { onChange, value },
    fieldState: { error },
  }: any) => (
    <TextInput
      testID="title_description_section.title"
      label={t('quiz:input_title')}
      value={value}
      maxLength={64}
      placeholder={t('quiz:input_title_placeholder')}
      onChangeText={onChange}
      error={!!error && !!error.message}
      helperText={!!error && error.message}
    />
  );

  const renderInputDescription = ({ field: { onChange, value } }: any) => (
    <TextArea
      testID="title_description_section.description"
      label={t('quiz:input_description')}
      value={value}
      placeholder={t('quiz:input_description_placeholder')}
      onChangeText={onChange}
      style={styles.containerInputDescription}
    />
  );

  return (
    <View>
      <Controller
        name="title"
        control={control}
        rules={{ required: t('quiz:title_is_required') }}
        render={renderInputTitle}
      />
      <Controller
        name="description"
        control={control}
        render={renderInputDescription}
      />
    </View>
  );
};

const createStyle = () => StyleSheet.create({
  container: {
    flex: 1,
  },
  btnSave: {
    marginRight: spacing.margin.small,
  },
  containerInputDescription: {
    paddingHorizontal: 0,
  },
});

export default TitleDescriptionSection;
