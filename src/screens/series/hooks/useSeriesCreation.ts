import { isEmpty, isEqual } from 'lodash';
import { Keyboard } from 'react-native';
import i18next from 'i18next';

import { useCallback, useEffect } from 'react';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';

import useSeriesStore, { ISeriesState } from '../store';
import useSelectAudienceStore, { ISelectAudienceState } from '~/components/SelectAudience/store';
import { IArticleCover, IAudience } from '~/interfaces/IPost';
import seriesStack from '~/router/navigator/MainStack/stacks/series/stack';
import { getAudienceIdsFromAudienceObject } from '~/screens/articles/CreateArticle/helper';
import { IEditArticleAudience } from '~/interfaces/IArticle';
import { useRootNavigation } from '~/hooks/navigation';
import useModalStore from '~/store/modal';
import useMyPermissionsStore from '~/store/permissions';
import { PermissionKey } from '~/constants/permissionScheme';

export interface IUseSeriesCreation {
    seriesId?: string;
    isFromDetail?: boolean;
    handleEditAudienceError?: (listIdAudiences: string[], groupsAudience: any[])=>void;
}

const isNonEmptyString = (str: string) => str?.trim?.()?.length > 0;

const getNames = (
  chosenAudiences: IAudience[],
) => {
  let result = '';
  if (chosenAudiences?.length > 0) {
    const newChosenAudiencesName = [];
    chosenAudiences.forEach((item: IAudience) => {
      newChosenAudiencesName.push(item?.name);
    });
    result = newChosenAudiencesName.join(', ');
  }
  return result;
};

const useSeriesCreation = ({ seriesId, isFromDetail, handleEditAudienceError }: IUseSeriesCreation) => {
  const { rootNavigation } = useRootNavigation();

  let series: any = {};
  if (!!seriesId) series = usePostsStore(useCallback(postsSelector.getPost(seriesId, {}), [seriesId]));

  const actions = useSeriesStore((state: ISeriesState) => state.actions);

  const data = useSeriesStore((state: ISeriesState) => state.data || {});
  const loading = useSeriesStore((state: ISeriesState) => state.loading);
  const dataGroups = useSeriesStore((state: ISeriesState) => state.groups || []);

  const audienceActions = useSelectAudienceStore((state: ISelectAudienceState) => state.actions);
  const { showAlert } = useModalStore((state) => state.actions);
  const { getAudienceListWithNoPermission } = useMyPermissionsStore((state) => state.actions);

  const names = getNames(dataGroups);

  const audiencesWithNoPermission = getAudienceListWithNoPermission(dataGroups, PermissionKey.EDIT_POST_SETTING);
  const disableSeriesSettings = audiencesWithNoPermission.length === dataGroups.length;

  const initSettings = (settings) => {
    const notExpired = new Date().getTime() < new Date(settings?.importantExpiredAt).getTime();
    const isNever = settings?.isImportant && !settings?.importantExpiredAt;

    const initData = {
      isImportant: (!!notExpired || isNever) && settings?.isImportant,
      importantExpiredAt: !!notExpired ? settings?.importantExpiredAt : null,
      canShare: settings?.canShare,
      canReact: settings?.canReact,
      canComment: settings?.canComment,
    };

    return initData;
  };

  useEffect(() => {
    if (!isEmpty(series)) {
      const newSelectingGroups = {};
      series.audience?.groups?.forEach((group) => {
        newSelectingGroups[group?.id] = group;
      });
      const audienceIds: IEditArticleAudience = getAudienceIdsFromAudienceObject(series.audience);
      actions.setData({
        ...series,
        audience: audienceIds,
        setting: initSettings(series.setting),
      });
      actions.setAudienceGroups(series.audience.groups);
      audienceActions.setSelectedAudiences(newSelectingGroups);
    }
  }, [series]);

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
    if (!!seriesId) {
      actions.editSeries(
        seriesId,
        isFromDetail,
        () => handleSave(),
        (listIdAudiences: string[]) => handleEditAudienceError?.(listIdAudiences, series.audience?.groups || []),
      );
    } else {
      actions.postCreateNewSeries();
    }
  };

  const isHasChange = () => {
    if (!!seriesId) {
      const isTitleUpdated = series.title !== data.title && isNonEmptyString(data.title);
      const isRequiredUnEmpty = isNonEmptyString(data.title) && !isEmpty(data.coverMedia);
      const isSummaryUpdated = series.summary !== data.summary && isRequiredUnEmpty;
      const isCoverMediaUpdated = (series.coverMedia?.id !== data.coverMedia?.id) && !isEmpty(data.coverMedia);
      const isAudienceUpdated = !isEqual(getAudienceIdsFromAudienceObject(series.audience), data.audience)
      && !(isEmpty(data.audience?.groupIds) && isEmpty(data.audience?.userIds));
      const isSettingsUpdated = !isEqual(series.setting, data.setting);

      return isTitleUpdated || isCoverMediaUpdated || isAudienceUpdated || isSummaryUpdated || isSettingsUpdated;
    }
    return isNonEmptyString(data.title) && !isEmpty(data.coverMedia);
  };

  const enableButtonSave = isHasChange();

  const handleBack = () => {
    if (enableButtonSave) {
      Keyboard.dismiss();
      showAlert({
        title: i18next.t('discard_alert:title'),
        content: i18next.t('discard_alert:content'),
        cancelBtn: true,
        cancelLabel: i18next.t('common:btn_discard'),
        confirmLabel: i18next.t('common:btn_stay_here'),
        onCancel: () => rootNavigation.goBack(),
      });
      return;
    }
    rootNavigation.goBack();
  };

  const handlePressAudiences = () => {
    rootNavigation.navigate(seriesStack.seriesSelectAudience,
      { isEditAudience: true, initAudienceGroups: dataGroups });
  };

  return {
    loading,
    title: data.title,
    summary: data.summary,
    coverMedia: data.coverMedia,
    audience: {
      names,
      count: data.audience?.groupIds?.length || 0,
      groups: dataGroups,
    },
    disableButtonSave: !enableButtonSave,
    audiencesWithNoPermission,
    disableSeriesSettings,
    handleTitleChange,
    handleSummaryChange,
    handleUploadCoverSuccess,
    handleSave,
    handleBack,
    handlePressAudiences,
  };
};

export default useSeriesCreation;
