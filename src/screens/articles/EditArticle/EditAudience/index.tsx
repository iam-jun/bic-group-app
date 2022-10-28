import React, { FC } from 'react';
import {
  View, StyleSheet, StyleProp, ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Header from '~/beinComponents/Header';

import { useBaseHook } from '~/hooks';
import { useBackPressListener } from '~/hooks/navigation';
import { EditArticleProps } from '~/interfaces/IArticle';
import useEditArticle from '~/screens/articles/EditArticle/hooks/useEditArticle';

export interface EditArticleAudienceProps {
  style?: StyleProp<ViewStyle>;
}

const EditArticleAudience: FC<EditArticleProps> = ({ route }: EditArticleProps) => {
  const articleId = route?.params?.articleId;

  // const actions = useEditArticleStore((state) => state.actions);
  // const title = useEditArticleStore((state) => state.data.title) || '';

  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const {
    handleSave, handleBack, enableButtonSave, loading,
  } = useEditArticle({ articleId });

  const disabled = !enableButtonSave || loading;

  useBackPressListener(handleBack);

  return (
    <View style={styles.container}>
      <Header
        title={t('article:title_edit_audience')}
        buttonProps={{ disabled, loading }}
        buttonText={t('common:btn_save')}
        onPressButton={handleSave}
        onPressBack={handleBack}
      />
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      backgroundColor: colors.neutral,
    },
  });
};

export default EditArticleAudience;
