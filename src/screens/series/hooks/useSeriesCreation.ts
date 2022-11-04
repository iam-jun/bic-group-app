import { isEmpty } from 'lodash';
import { Keyboard } from 'react-native';
import i18next from 'i18next';

import { withNavigation } from '~/router/helper';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import Store from '~/storeRedux';
import modalActions from '~/storeRedux/modal/actions';

import { rootNavigationRef } from '~/router/refs';
import useSeriesStore, { ISeriesState } from '../store';
import useSelectAudienceStore, { ISelectAudienceState } from '~/components/SelectAudience/store';
import { IArticleCover } from '~/interfaces/IPost';
import seriesStack from '~/router/navigator/MainStack/stacks/series/stack';

const navigation = withNavigation(rootNavigationRef);

export interface IUseSeriesCreation {
    seriesId?: string;
}

const isNonEmptyString = (str: string) => str?.trim?.()?.length > 0;

const getNames = (
  ids: string[], data: any,
) => {
  let result = '';
  if (ids?.length > 0 && !isEmpty(data)) {
    const newNames = [];
    ids.forEach((id: string) => {
      const name = data?.[id]?.name || '';
      newNames.push(name);
    });
    result = newNames.join(', ');
  }
  return result;
};

const useSeriesCreation = ({ seriesId }: IUseSeriesCreation) => {
  let series: any = {};
  if (!!seriesId) series = usePostsStore(postsSelector.getPost(seriesId));

  const actions = useSeriesStore((state: ISeriesState) => state.actions);

  const data = useSeriesStore((state: ISeriesState) => state.data) || {};
  const loading = useSeriesStore((state: ISeriesState) => state.loading);

  const chosenAudienceGroups = useSelectAudienceStore((state: ISelectAudienceState) => state.selecting?.groups);
  const names = getNames(
    data.audience?.groupIds, chosenAudienceGroups,
  );

  const handleTitleChange = (newTitle: string) => {
    actions.setTitle(newTitle);
  };

  const handleSummaryChange = (newSummary: string) => {
    actions.setSummary(newSummary);
  };

  const handleUploadCoverSuccess = (cover:IArticleCover) => {
    actions.setCover(cover);
  };

  const handleSave = () => {
    Keyboard.dismiss();
    actions.postCreateNewSeries();
  };

  const isHasChange = () => {
    if (!!seriesId) {
      const isTitleUpdated = series.title !== data.title && isNonEmptyString(data.title);
      const isSummaryUpdated = series.summary !== data.summary && isNonEmptyString(data.summary);
      const isCoverMediaUpdated = (series.coverMedia?.id !== data.coverMedia?.id) && !isEmpty(data.coverMedia);
      return isTitleUpdated || isCoverMediaUpdated || isSummaryUpdated;
    }
    return isNonEmptyString(data.title) && !isEmpty(data.coverMedia);
    // const isAudienceUpdated = !isEqual(getAudienceIdsFromAudienceObject(article.audience), data.audience)
    // && !(isEmpty(data.audience?.groupIds) && isEmpty(data.audience?.userIds));
  };

  const enableButtonSave = isHasChange();

  const handleBack = () => {
    if (enableButtonSave) {
      Keyboard.dismiss();
      Store.store.dispatch(modalActions.showAlert({
        title: i18next.t('discard_alert:title'),
        content: i18next.t('discard_alert:content'),
        cancelBtn: true,
        cancelLabel: i18next.t('common:btn_discard'),
        confirmLabel: i18next.t('common:btn_stay_here'),
        onCancel: () => navigation.goBack(),
      }));
      return;
    }
    navigation.goBack();
  };

  const handlePressAudiences = () => {
    navigation.navigate(seriesStack.seriesSelectAudience, { isEditAudience: true });
  };

  return {
    loading,
    title: data.title,
    summary: data.summary,
    coverMedia: data.coverMedia,
    audience: {
      names,
      count: data.audience?.groupIds?.length || 0,
    },
    disableButtonSave: !enableButtonSave,
    handleTitleChange,
    handleSummaryChange,
    handleUploadCoverSuccess,
    handleSave,
    handleBack,
    handlePressAudiences,
  };
};

export default useSeriesCreation;
