import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextArea } from '~/baseComponents/Input';
import Header from '~/beinComponents/Header';

import useMentionInputStore from '~/beinComponents/inputs/MentionInput/store';
import { useBaseHook } from '~/hooks';
import { useBackPressListener, useRootNavigation } from '~/hooks/navigation';
import { CreateArticleProps } from '~/interfaces/IArticle';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import useCreateArticle from '~/screens/articles/CreateArticle/hooks/useCreateArticle';
import useCreateArticleStore from '~/screens/articles/CreateArticle/store';
import spacing from '~/theme/spacing';

const CreateArticleTitle: FC<CreateArticleProps> = ({
  route,
}: CreateArticleProps) => {
  const articleId = route?.params?.articleId;
  const isDraft = route?.params?.isDraft;

  const { rootNavigation } = useRootNavigation();

  const actions = useCreateArticleStore((state) => state.actions);
  const title = useCreateArticleStore((state) => state.data.title) || '';

  const resetEditArticleStore = useCreateArticleStore((state) => state.reset);
  const resetMentionInputStore = useMentionInputStore((state) => state.reset);

  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const {
    handleBack, handleSave, enableButtonSave, validButtonNext, loading,
  } = useCreateArticle({
    articleId,
    needToPublish: isDraft,
  });

  const disabled = (isDraft ? !validButtonNext.isTitleValid : !enableButtonSave) || loading;

  useBackPressListener(handleBack);

  const onChangeText = (value) => {
    actions.setTitle(value);
  };

  const goNextStep = () => {
    rootNavigation.navigate(articleStack.createArticleSummary, { articleId });
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
        useI18n
        title="article:text_option_edit_title"
        buttonProps={{ disabled, loading, style: styles.btnNext }}
        buttonText={isDraft ? 'common:btn_next' : 'common:btn_save'}
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

export default CreateArticleTitle;
