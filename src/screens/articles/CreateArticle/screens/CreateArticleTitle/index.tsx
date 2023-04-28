import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput } from '~/baseComponents/Input';
import Header from '~/beinComponents/Header';

import { useBaseHook } from '~/hooks';
import { useBackPressListener } from '~/hooks/navigation';
import { CreateArticleProps } from '~/interfaces/IArticle';
import useCreateArticle from '~/screens/articles/CreateArticle/hooks/useCreateArticle';
import useCreateArticleStore from '~/screens/articles/CreateArticle/store';
import spacing from '~/theme/spacing';
import Text from '~/baseComponents/Text';

const CreateArticleTitle: FC<CreateArticleProps> = ({
  route,
}: CreateArticleProps) => {
  const articleId = route?.params?.articleId;

  const actions = useCreateArticleStore((state) => state.actions);
  const title = useCreateArticleStore((state) => state.data.title) || '';

  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const {
    handleBack, handleSave, enableButtonSave, loading,
  }
    = useCreateArticle({
      articleId,
    });

  const disabled = !enableButtonSave || loading;

  useBackPressListener(handleBack);

  const onChangeText = (value) => {
    actions.setTitle(value);
  };

  return (
    <View style={styles.container}>
      <Header
        useI18n
        title="article:text_option_edit_title"
        buttonProps={{ disabled, loading, style: styles.btnSave }}
        buttonText="common:btn_save"
        onPressButton={handleSave}
        onPressBack={handleBack}
        removeBorderAndShadow
        style={styles.header}
      />
      <View style={styles.content}>
        <TextInput
          autoFocus
          testID="edit_title"
          value={title}
          maxLength={64}
          placeholder={t('common:text_input_title')}
          onChangeText={onChangeText}
        />
        <Text.BodyS color={colors.neutral40} useI18n>
          article:text_title_require_max_length
        </Text.BodyS>
      </View>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    header: {
      borderBottomWidth: 1,
      borderBottomColor: colors.neutral5,
    },
    container: {
      flex: 1,
      backgroundColor: colors.neutral,
    },
    btnSave: {
      marginRight: spacing.margin.small,
    },
    content: {
      padding: spacing.padding.large,
    },
  });
};

export default CreateArticleTitle;
