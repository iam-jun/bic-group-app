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
import { AlertDeleteAudiences } from '~/components/posts';
import modalActions from '~/storeRedux/modal/actions';
import Store from '~/storeRedux';
import { IAudienceGroup } from '~/interfaces/IPost';
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
  const selectingAudienceGroups = useSelectAudienceStore((state) => state.selectedAudiences.groups);

  // self check instead of use enableButtonSave from hook to avoid delay
  const isAudienceValidForSave = !isEqual(initAudienceIds, selectedAudienceIds)
    && !(isEmpty(selectedAudienceIds?.groupIds) && isEmpty(selectedAudienceIds?.userIds));
  const isChanged = !isEqual(initAudienceIds, selectedAudienceIds);

  const handleSaveError = (listIdAudiences: string[]) => {
    const audienceGroups = Object.values(selectingAudienceGroups);
    if (listIdAudiences?.length <= 0 || audienceGroups?.length <= 0) {
      return;
    }

    const listAudiences = listIdAudiences.map((audienceId) => {
      const _audience = audienceGroups.find(
        (audience: IAudienceGroup) => audience?.id === audienceId,
      );
      return _audience;
    });
    Store.store.dispatch(modalActions.showAlert({
      title: t('article:remove_audiences_contains_series_title'),
      children: <AlertDeleteAudiences
        data={listAudiences}
        textContent={t('series:content_not_able_delete_of_series')}
      />,
      cancelBtn: true,
      cancelLabel: t('common:btn_close'),
      onConfirm: null,
    }));
  };

  const {
    handleBack, handleSave, loading, handleAudiencesChange,
  } = useCreateArticle({ articleId, handleSaveAudienceError: handleSaveError });

  const disabled = !isAudienceValidForSave || loading;

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

  return (
    <View style={styles.container}>
      <Header
        title={t('article:text_option_edit_audience')}
        buttonProps={{ disabled, loading, style: styles.btnSave }}
        buttonText={t('common:btn_save')}
        onPressButton={handleSave}
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
