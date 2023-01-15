import React, { FC, useEffect, useMemo } from 'react';
import {
  View, StyleSheet, StyleProp, ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { isEmpty, isEqual } from 'lodash';
import Header from '~/beinComponents/Header';
import SelectAudience, { ContentType } from '~/components/SelectAudience';
import useSelectAudienceStore from '~/components/SelectAudience/store';

import { useBaseHook } from '~/hooks';
import { CreateArticleProps } from '~/interfaces/IArticle';
import useCreateArticle from '~/screens/articles/CreateArticle/hooks/useCreateArticle';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import { spacing } from '~/theme';
import { getAudienceIdsFromAudienceObject } from '../../helper';
import { useBackPressListener } from '~/hooks/navigation';

export interface EditArticleAudienceProps {
  style?: StyleProp<ViewStyle>;
}

const CreateArticleAudience: FC<CreateArticleProps> = ({ route }: CreateArticleProps) => {
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const articleId = route?.params?.articleId;
  const article = usePostsStore(postsSelector.getPost(articleId));

  const initAudienceIds = useMemo(
    () => getAudienceIdsFromAudienceObject(article.audience), [article.audience],
  );

  const selectAudienceActions = useSelectAudienceStore((state) => state.actions);
  const selectedAudienceIds = useSelectAudienceStore((state) => state.selectedIds);

  // self check instead of use enableButtonSave from hook to avoid delay
  const isAudienceValidForSave = !isEqual(initAudienceIds, selectedAudienceIds)
    && !(isEmpty(selectedAudienceIds?.groupIds) && isEmpty(selectedAudienceIds?.userIds));
  const isChanged = !isEqual(initAudienceIds, selectedAudienceIds);

  const {
    handleBack, handleSave, loading, isValidating, handleAudiencesChange,
  } = useCreateArticle({ articleId });

  const disabled = !isAudienceValidForSave || isValidating || loading;
  const isLoading = isValidating || loading;

  useBackPressListener(handleBack);

  useEffect(() => {
    const newSelectingGroups = {};
    article.audience?.groups?.forEach((group) => {
      newSelectingGroups[group?.id] = group;
    });
    selectAudienceActions.setSelectedAudiences(newSelectingGroups);
  }, [article.audience]);

  useEffect(() => {
    if (isAudienceValidForSave) {
      handleAudiencesChange(selectedAudienceIds);
    }
  }, [selectedAudienceIds]);

  const onBack = () => {
    handleBack(isChanged);
  };

  const onPressSave = () => handleSave(
    { shouldValidateSeriesTags: true, titleAlert: 'article:modal_invalid_series_tags:title_remove_audience' },
  );

  return (
    <View style={styles.container}>
      <Header
        title={t('article:text_option_edit_audience')}
        buttonProps={{ disabled, loading: isLoading, style: styles.btnSave }}
        buttonText={t('common:btn_save')}
        onPressButton={onPressSave}
        onPressBack={onBack}
      />
      <SelectAudience contentType={ContentType.ARTICLE} />
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
    btnSave: {
      marginRight: spacing.margin.small,
    },
  });
};

export default CreateArticleAudience;
