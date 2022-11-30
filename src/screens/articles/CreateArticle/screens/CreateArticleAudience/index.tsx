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
import { CreateArticleProps } from '~/interfaces/IArticle';
import useCreateArticle from '~/screens/articles/CreateArticle/hooks/useCreateArticle';
import useCreateArticleStore from '~/screens/articles/CreateArticle/store';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import { spacing } from '~/theme';
import { getAudienceIdsFromAudienceObject } from '../../helper';
import { AlertDeleteAudiences } from '~/components/posts';
import modalActions from '~/storeRedux/modal/actions';
import Store from '~/storeRedux';
import { IAudienceGroup } from '~/interfaces/IPost';

export interface EditArticleAudienceProps {
  style?: StyleProp<ViewStyle>;
}

const CreateArticleAudience: FC<CreateArticleProps> = ({ route }: CreateArticleProps) => {
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const articleId = route?.params?.articleId;
  const article = usePostsStore(postsSelector.getPost(articleId));

  const { rootNavigation } = useRootNavigation();

  const initAudienceIds = useMemo(
    () => getAudienceIdsFromAudienceObject(article.audience), [article.audience],
  );

  const isPublishing = useCreateArticleStore((state) => state.isPublishing);

  const selectAudienceActions = useSelectAudienceStore((state) => state.actions);
  const selectedAudienceIds = useSelectAudienceStore((state) => state.selectedIds);
  const selectingAudienceGroups = useSelectAudienceStore((state) => state.selectedAudiences.groups);

  // self check instead of use enableButtonNext from hook to avoid delay
  const isAudienceValidForNext = !isEmpty(selectedAudienceIds?.groupIds) || !isEmpty(selectedAudienceIds?.userIds);

  // self check instead of use enableButtonSave from hook to avoid delay
  const isAudienceValidForSave = !isEqual(initAudienceIds, selectedAudienceIds)
    && !(isEmpty(selectedAudienceIds?.groupIds) && isEmpty(selectedAudienceIds?.userIds));

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

  const disabled = (isPublishing ? !isAudienceValidForNext : !isAudienceValidForSave) || loading;

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

  const goNextStep = () => {
    rootNavigation.navigate(articleStack.createArticleSeries, { articleId });
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

export default CreateArticleAudience;
