import React, { FC } from 'react';
import {
  View, StyleSheet,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { TextArea } from '~/baseComponents/Input';
import Header from '~/beinComponents/Header';

import { useBaseHook } from '~/hooks';
import { useRootNavigation } from '~/hooks/navigation';
import { EditArticleProps } from '~/interfaces/IArticle';
import useEditArticle from '~/screens/articles/EditArticle/hooks/useEditArticle';
import useEditArticleStore from '~/screens/articles/EditArticle/store';
import spacing from '~/theme/spacing';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';

const EditArticleSummary: FC<EditArticleProps> = ({ route }: EditArticleProps) => {
  const articleId = route?.params?.articleId;

  const { rootNavigation } = useRootNavigation();

  const actions = useEditArticleStore((state) => state.actions);
  const summary = useEditArticleStore((state) => state.data.summary) || '';
  const isPublishing = useEditArticleStore((state) => state.isPublishing);

  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const {
    handleBack, handleSave, enableButtonSave, loading,
  } = useEditArticle({ articleId });

  const disabled = (isPublishing ? false : !enableButtonSave) || loading;

  const onChangeText = (value) => {
    actions.setSummary(value);
  };

  const goNextStep = () => {
    rootNavigation.navigate(articleStack.editArticleCover, { articleId });
  };

  const goBack = () => {
    rootNavigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header
        title={t('article:text_option_edit_description')}
        buttonProps={{ disabled, loading, style: styles.btnNext }}
        buttonText={t(isPublishing ? 'common:btn_next' : 'common:btn_save')}
        onPressButton={isPublishing ? goNextStep : handleSave}
        onPressBack={isPublishing ? goBack : handleBack}
      />
      <TextArea
        testID="edit_description"
        value={summary}
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

export default EditArticleSummary;
