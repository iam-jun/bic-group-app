import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import {
  Keyboard, StyleSheet, TextInput, View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import Header from '~/beinComponents/Header';
import { createTextStyle } from '~/beinComponents/Text/textStyle';

import { useBaseHook } from '~/hooks';
import { useBackPressListener, useRootNavigation } from '~/hooks/navigation';
import ArticleWebview from '~/screens/articles/components/ArticleWebview';
import useEditArticle from '~/screens/articles/EditArticle/hooks/useEditArticle';
import modalActions from '~/storeRedux/modal/actions';
import spacing from '~/theme/spacing';

export interface EditArticleContentProps {
  route?: {
    params?: {articleId: string};
  };
}

const TITLE_MAX_LENGTH = 64;

const EditArticleContent: FC<EditArticleContentProps> = ({ route }: EditArticleContentProps) => {
  const articleId = route?.params?.articleId;

  const dispatch = useDispatch();
  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const articleData = useEditArticle({ articleId });
  const {
    loading, enableButtonSave, title, handleTitleChange, handleSave,
  } = articleData || {};

  const onPressBack = () => {
    if (enableButtonSave) {
      Keyboard.dismiss();
      dispatch(modalActions.showAlert({
        title: t('discard_alert:title'),
        content: t('discard_alert:content'),
        cancelBtn: true,
        cancelLabel: t('common:btn_discard'),
        confirmLabel: t('common:btn_stay_here'),
        onCancel: () => rootNavigation.goBack(),
      }));
      return;
    }
    rootNavigation.goBack();
  };

  useBackPressListener(onPressBack);

  const onChangeTitle = (value) => {
    handleTitleChange(value);
  };

  const onPressSave = () => {
    handleSave();
  };

  const disabled = !enableButtonSave || loading;

  return (
    <View style={styles.container}>
      <Header
        title={t('article:title_edit_content')}
        buttonProps={{ disabled, loading }}
        buttonText={t('common:btn_save')}
        onPressButton={onPressSave}
        onPressBack={onPressBack}
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
  });
};

export default EditArticleContent;
