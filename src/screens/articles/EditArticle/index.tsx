import { debounce } from 'lodash';
import React, { FC, useRef } from 'react';
import {
  View, StyleSheet, TextInput, Keyboard,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import Header from '~/beinComponents/Header';
import MentionInput from '~/beinComponents/inputs/MentionInput';
import PostInput from '~/beinComponents/inputs/PostInput';
import { createTextStyle } from '~/beinComponents/Text/textStyle';

import { useBaseHook } from '~/hooks';
import { useBackPressListener, useRootNavigation } from '~/hooks/navigation';
import EditArticleFooter from '~/screens/articles/EditArticle/components/EditArticleFooter';
import useEditArticle from '~/screens/articles/EditArticle/hooks/useEditArticle';
import modalActions from '~/storeRedux/modal/actions';
import spacing from '~/theme/spacing';

export interface EditArticleProps {
  route?: {
    params?: {articleId: string};
  };
}

const TITLE_MAX_LENGTH = 64;

const EditArticle: FC<EditArticleProps> = ({ route }: EditArticleProps) => {
  const articleId = route?.params?.articleId;

  const mentionInputRef = useRef<any>();
  const refTextInput = useRef<any>();

  const dispatch = useDispatch();
  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const {
    loading, enableButtonSave, title, content, groupIds, handleContentChange, handleTitleChange, handleSave,
  } = useEditArticle({ articleId });

  const onChangeContent = debounce((value) => {
    handleContentChange(value);
  }, 500);

  const onChangeTitle = (value) => {
    handleTitleChange(value);
  };

  const onPressSave = () => {
    handleSave();
  };

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

  return (
    <View style={styles.container}>
      <Header
        title={t('article:title_edit_article')}
        buttonProps={{ disabled: !enableButtonSave || loading, loading }}
        buttonText={t('common:btn_save')}
        onPressButton={onPressSave}
        onPressBack={onPressBack}
      />
      <TextInput
        value={title}
        onChangeText={onChangeTitle}
        numberOfLines={2}
        multiline
        maxLength={TITLE_MAX_LENGTH}
        style={styles.inputTitle}
        selectionColor={theme.colors.gray50}
        placeholderTextColor={theme.colors.neutral20}
      />
      <MentionInput
        disableAutoComplete
        groupIds={groupIds}
        mentionInputRef={mentionInputRef}
        style={styles.flex1}
        textInputStyle={styles.flex1}
        autocompleteProps={{
          modalPosition: 'bottom',
          title: t('post:mention_title'),
          emptyContent: t('post:mention_empty_content'),
          showShadow: true,
          modalStyle: { maxHeight: 350 },
        }}
        ComponentInput={PostInput}
        componentInputProps={{
          value: content,
          onChangeText: onChangeContent,
          inputRef: refTextInput,
          scrollEnabled: false,
        }}
        disabled={loading}
      />
      <EditArticleFooter />
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

export default EditArticle;
