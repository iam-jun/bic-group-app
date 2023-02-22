import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextArea } from '~/baseComponents/Input';
import Header from '~/beinComponents/Header';

import { useBaseHook } from '~/hooks';
import { CreateArticleProps } from '~/interfaces/IArticle';
import useCreateArticle from '~/screens/articles/CreateArticle/hooks/useCreateArticle';
import useCreateArticleStore from '~/screens/articles/CreateArticle/store';
import spacing from '~/theme/spacing';
import Text from '~/baseComponents/Text';
import { useBackPressListener } from '~/hooks/navigation';

const CreateArticleSummary: FC<CreateArticleProps> = ({ route }: CreateArticleProps) => {
  const articleId = route?.params?.articleId;

  const actions = useCreateArticleStore((state) => state.actions);
  const summary = useCreateArticleStore((state) => state.data.summary) || '';

  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);
  const { colors } = theme;

  const {
    handleBack, handleSave, enableButtonSave, loading,
  } = useCreateArticle({ articleId });

  const disabled = !enableButtonSave || loading;

  useBackPressListener(handleBack);

  const onChangeText = (value) => {
    actions.setSummary(value);
  };

  return (
    <View style={styles.container}>
      <Header
        title={t('article:text_option_edit_summary')}
        buttonProps={{ disabled, loading, style: styles.btnSave }}
        buttonText={t('common:btn_save')}
        onPressButton={handleSave}
        onPressBack={handleBack}
      />
      <TextArea
        autoFocus
        testID="edit_summary"
        value={summary}
        placeholder={t('common:text_input_summary')}
        style={styles.textInputContainer}
        inputStyle={styles.textInput}
        onChangeText={onChangeText}
        showCountLength={false}
      />
      <Text.BodyS color={colors.neutral40} useI18n style={styles.textMaxLength}>
        article:text_description_require_max_length
      </Text.BodyS>
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
      paddingHorizontal: spacing.padding.large,
      paddingBottom: spacing.padding.tiny,
    },
    textInput: {
      paddingVertical: 0,
      marginBottom: 0,
    },
    btnSave: {
      marginRight: spacing.margin.small,
    },
    textMaxLength: {
      marginHorizontal: spacing.margin.large,
    },
  });
};

export default CreateArticleSummary;
