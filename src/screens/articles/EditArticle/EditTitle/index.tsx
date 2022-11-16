import React, { FC, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { TextArea } from '~/baseComponents/Input';
import Header from '~/beinComponents/Header';

import { useBaseHook } from '~/hooks';
import { useBackPressListener, useRootNavigation } from '~/hooks/navigation';
import { EditArticleProps } from '~/interfaces/IArticle';
import useEditArticle from '~/screens/articles/EditArticle/hooks/useEditArticle';
import useEditArticleStore from '~/screens/articles/EditArticle/store';
import spacing from '~/theme/spacing';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import useMentionInputStore from '~/beinComponents/inputs/MentionInput/store';

const EditArticleTitle: FC<EditArticleProps> = ({
  route,
}: EditArticleProps) => {
  const articleId = route?.params?.articleId;
  const isDraft = route?.params?.isDraft;

  const { rootNavigation } = useRootNavigation();

  const actions = useEditArticleStore((state) => state.actions);
  const title = useEditArticleStore((state) => state.data.title) || '';

  const resetEditArticleStore = useEditArticleStore((state) => state.reset);
  const resetMentionInputStore = useMentionInputStore((state) => state.reset);

  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const {
    handleBack, handleSave, enableButtonSave, enableButtonNext, loading,
  } = useEditArticle({
    articleId,
    needToPublish: isDraft,
  });

  const disabled = (isDraft ? !enableButtonNext : !enableButtonSave) || loading;

  useBackPressListener(handleBack);

  const onChangeText = (value) => {
    actions.setTitle(value);
  };

  const goNextStep = () => {
    rootNavigation.navigate(articleStack.editArticleSummary, { articleId });
  };

  useEffect(
    () => () => {
      resetEditArticleStore();
      resetMentionInputStore();
    },
    [],
  );

  return (
    <View style={styles.container}>
      <Header
        title={t('article:text_option_edit_title')}
        buttonProps={{ disabled, loading, style: styles.btnNext }}
        buttonText={t(isDraft ? 'common:btn_next' : 'common:btn_save')}
        onPressButton={isDraft ? goNextStep : handleSave}
        onPressBack={handleBack}
      />
      <TextArea
        testID="edit_title"
        value={title}
        maxLength={64}
        placeholder={t('common:text_input_title')}
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
      paddingHorizontal: spacing.padding.large,
    },
    textInput: {
      paddingVertical: 0,
    },
    btnNext: {
      marginRight: spacing.margin.small,
    },
  });
};

export default EditArticleTitle;
