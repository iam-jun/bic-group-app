import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Header from '~/beinComponents/Header';
import { createTextStyle } from '~/beinComponents/Text/textStyle';

import { useBaseHook } from '~/hooks';
import { useRootNavigation } from '~/hooks/navigation';
import ArticleWebview from '~/components/articles/ArticleWebview';
import useEditArticle from '~/screens/articles/EditArticle/hooks/useEditArticle';
import spacing from '~/theme/spacing';
import useEditArticleStore from '../store';

export interface EditArticleContentProps {
  route?: {
    params?: {articleId: string};
  };
}

const TITLE_MAX_LENGTH = 64;

const EditArticleContent: FC<EditArticleContentProps> = ({ route }: EditArticleContentProps) => {
  const articleId = route?.params?.articleId;

  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const articleData = useEditArticle({ articleId });
  const {
    loading, enableButtonSave, enableButtonNext, title, handleTitleChange, handleSave, handleBack,
  } = articleData || {};
  const isPublishing = useEditArticleStore((state) => state.isPublishing);

  const onChangeTitle = (value) => {
    handleTitleChange(value);
  };

  const disabled = (isPublishing ? !enableButtonNext : !enableButtonSave) || loading;

  const onPressSave = () => {
    handleSave();
  };

  const goBack = () => {
    rootNavigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header
        title={t('article:text_option_edit_content')}
        buttonProps={{ disabled, loading, style: styles.btnPublish }}
        buttonText={t(isPublishing ? 'common:btn_publish' : 'common:btn_save')}
        onPressButton={onPressSave}
        onPressBack={isPublishing ? goBack : handleBack}
      />
      <View style={styles.flex1}>
        <TextInput
          multiline
          value={title}
          numberOfLines={2}
          style={styles.inputTitle}
          maxLength={TITLE_MAX_LENGTH}
          selectionColor={theme.colors.gray50}
          placeholderTextColor={theme.colors.neutral20}
          onChangeText={onChangeTitle}
        />
        <ArticleWebview
          articleData={articleData}
        />
      </View>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const textStyle = createTextStyle(theme);

  const { colors } = theme;
  return StyleSheet.create({
    flex1: { flex: 1 },
    container: {
      flex: 1,
      backgroundColor: colors.neutral,
    },
    inputTitle: {
      ...textStyle.bodyMMedium,
      paddingVertical: spacing.padding.small,
      paddingHorizontal: spacing.padding.large,
      borderBottomWidth: 1,
      borderColor: colors.gray5,
      maxHeight: 80,
    },
    btnPublish: {
      marginRight: spacing.margin.small,
    },
  });
};

export default EditArticleContent;
