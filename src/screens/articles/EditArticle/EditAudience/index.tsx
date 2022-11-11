import { isEmpty, isEqual } from 'lodash';
import React, { FC, useEffect, useMemo } from 'react';
import {
  View, StyleSheet, StyleProp, ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Header from '~/beinComponents/Header';
import SelectAudience from '~/components/SelectAudience';
import useSelectAudienceStore from '~/components/SelectAudience/store';

import { useBaseHook } from '~/hooks';
import { useBackPressListener } from '~/hooks/navigation';
import { EditArticleProps } from '~/interfaces/IArticle';
import { getAudienceIdsFromAudienceObject } from '~/screens/articles/EditArticle/helper';
import useEditArticle from '~/screens/articles/EditArticle/hooks/useEditArticle';
import useEditArticleStore from '~/screens/articles/EditArticle/store';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';

export interface EditArticleAudienceProps {
  style?: StyleProp<ViewStyle>;
}

const EditArticleAudience: FC<EditArticleProps> = ({ route }: EditArticleProps) => {
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const articleId = route?.params?.articleId;
  const article = usePostsStore(postsSelector.getPost(articleId));

  const initAudienceIds = useMemo(
    () => getAudienceIdsFromAudienceObject(article.audience), [article.audience],
  );

  const editArticleActions = useEditArticleStore((state) => state.actions);

  const selectAudienceActions = useSelectAudienceStore((state) => state.actions);
  const selectingAudienceIds = useSelectAudienceStore((state) => state.selectingIds);

  // self check instead of use enableButtonSave from hook to avoid delay
  const isAudienceUpdated = !isEqual(initAudienceIds, selectingAudienceIds)
    && !(isEmpty(selectingAudienceIds?.groupIds) && isEmpty(selectingAudienceIds?.userIds));

  const {
    handleSave, handleBack, loading,
  } = useEditArticle({ articleId });

  const disabled = !isAudienceUpdated || loading;

  useEffect(() => {
    editArticleActions.setAudience(selectingAudienceIds);
  }, [selectingAudienceIds]);

  useEffect(() => {
    const newSelectingGroups = {};
    article.audience?.groups?.forEach((group) => {
      newSelectingGroups[group?.id] = group;
    });
    selectAudienceActions.setSelectingGroups(newSelectingGroups);
  }, [article.audience]);

  const onBack = () => {
    handleBack(isAudienceUpdated);
  };

  useBackPressListener(onBack);

  return (
    <View style={styles.container}>
      <Header
        title={t('article:title_edit_audience')}
        buttonProps={{ disabled, loading }}
        buttonText={t('common:btn_save')}
        onPressButton={handleSave}
        onPressBack={onBack}
      />
      <SelectAudience />
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
  });
};

export default EditArticleAudience;
