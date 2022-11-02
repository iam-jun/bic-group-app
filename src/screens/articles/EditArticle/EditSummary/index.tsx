import React, { FC } from 'react';
import {
  View, StyleSheet,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { TextArea } from '~/baseComponents/Input';
import Header from '~/beinComponents/Header';

import { useBaseHook } from '~/hooks';
import { useBackPressListener } from '~/hooks/navigation';
import { EditArticleProps } from '~/interfaces/IArticle';
import useEditArticle from '~/screens/articles/EditArticle/hooks/useEditArticle';
import useEditArticleStore from '~/screens/articles/EditArticle/store';
import spacing from '~/theme/spacing';

const EditArticleSummary: FC<EditArticleProps> = ({ route }: EditArticleProps) => {
  const articleId = route?.params?.articleId;

  const actions = useEditArticleStore((state) => state.actions);
  const summary = useEditArticleStore((state) => state.data.summary) || '';

  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const {
    handleSave, handleBack, enableButtonSave, loading,
  } = useEditArticle({ articleId });

  const disabled = !enableButtonSave || loading;

  useBackPressListener(handleBack);

  const onChangeText = (value) => {
    actions.setSummary(value);
  };

  return (
    <View style={styles.container}>
      <Header
        title={t('article:title_edit_description')}
        buttonProps={{ disabled, loading }}
        buttonText={t('common:btn_save')}
        onPressButton={handleSave}
        onPressBack={handleBack}
      />
      <TextArea
        testID="edit_description"
        value={summary}
        label={t('settings:text_description')}
        placeholder={t('common:text_input_description')}
        style={styles.textInputContainer}
        inputStyle={styles.textInput}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.neutral,
    },
    textInputContainer: {
      paddingHorizontal: spacing.padding.extraLarge,
    },
    textInput: {
      paddingVertical: 0,
    },
  });
};

export default EditArticleSummary;
