import React, { FC, useEffect, useMemo } from 'react';
import {
  View, StyleSheet, StyleProp, ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { isEmpty, isEqual } from 'lodash';
import Header from '~/beinComponents/Header';
import SelectAudience from '~/components/SelectAudience';
import useSelectAudienceStore from '~/components/SelectAudience/store';

import { useBaseHook } from '~/hooks';
import { useRootNavigation } from '~/hooks/navigation';
import { EditArticleProps } from '~/interfaces/IArticle';
import useEditArticle from '~/screens/articles/EditArticle/hooks/useEditArticle';
import useEditArticleStore from '~/screens/articles/EditArticle/store';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import { spacing } from '~/theme';
import { getAudienceIdsFromAudienceObject } from '../helper';

export interface EditArticleAudienceProps {
  style?: StyleProp<ViewStyle>;
}

const EditArticleAudience: FC<EditArticleProps> = ({ route }: EditArticleProps) => {
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const articleId = route?.params?.articleId;
  const article = usePostsStore(postsSelector.getPost(articleId));

  const { rootNavigation } = useRootNavigation();

  const initAudienceIds = useMemo(
    () => getAudienceIdsFromAudienceObject(article.audience), [article.audience],
  );

  const editArticleActions = useEditArticleStore((state) => state.actions);
  const isPublishing = useEditArticleStore((state) => state.isPublishing);

  const selectAudienceActions = useSelectAudienceStore((state) => state.actions);
  const selectingAudienceIds = useSelectAudienceStore((state) => state.selectingIds);

  // self check instead of use enableButtonNext from hook to avoid delay
  const isAudienceValidForNext = !isEmpty(selectingAudienceIds?.groupIds) || !isEmpty(selectingAudienceIds?.userIds);

  // self check instead of use enableButtonSave from hook to avoid delay
  const isAudienceValidForSave = !isEqual(initAudienceIds, selectingAudienceIds)
    && !(isEmpty(selectingAudienceIds?.groupIds) && isEmpty(selectingAudienceIds?.userIds));

  const {
    handleBack, handleSave, loading,
  } = useEditArticle({ articleId });

  const disabled = (isPublishing ? !isAudienceValidForNext : !isAudienceValidForSave) || loading;

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

  const goNextStep = () => {
    rootNavigation.navigate(articleStack.editArticleSeries, { articleId });
  };

  const goBack = () => {
    rootNavigation.goBack();
  };

  const onBack = () => {
    handleBack(!disabled);
  };

  return (
    <View style={styles.container}>
      <Header
        title={t('article:text_option_edit_audience')}
        buttonProps={{ disabled, loading, style: styles.btnNext }}
        buttonText={t(isPublishing ? 'common:btn_next' : 'common:btn_save')}
        onPressButton={isPublishing ? goNextStep : handleSave}
        onPressBack={isPublishing ? goBack : onBack}
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
    btnNext: {
      marginRight: spacing.margin.small,
    },
  });
};

export default EditArticleAudience;
