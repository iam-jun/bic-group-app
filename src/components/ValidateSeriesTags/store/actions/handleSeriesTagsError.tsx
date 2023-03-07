import React from 'react';
import i18next from 'i18next';
import useCreateArticleStore from '~/screens/articles/CreateArticle/store';
import showAlert from '~/store/helper/showAlert';
import { HandleSeriesTagsErrorParams } from '..';
import InvalidSeriesTagsContentModal from '../../components/InvalidSeriesTagsContentModal';
import { Button } from '~/baseComponents';
import { PostType } from '~/interfaces/IPost';
import useCreatePostStore from '~/screens/post/CreatePost/store';
import showToastError from '~/store/helper/showToastError';
import ApiErrorCode from '~/constants/apiErrorCode';

const removeSeriesTagsArticle = (seriesIds: string[], tagIds: string[]) => {
  const state = useCreateArticleStore.getState();
  const { data, actions } = state || {};
  const { series, tags } = data || {};
  const newSeries = series?.filter?.((item) => !seriesIds.includes(item.id));
  const newTags = tags?.filter?.((item) => !tagIds.includes(item.id));
  actions.setSeries(newSeries);
  actions.setTags(newTags);
};

const removeSeriesTagsPost = (seriesIds: string[], tagIds: string[]) => {
  const state = useCreatePostStore.getState();
  const { createPost, actions } = state || {};
  const { series, tags } = createPost || {};
  const newSeries = series?.filter?.((item) => !seriesIds.includes(item.id));
  const newTags = tags?.filter?.((item) => !tagIds.includes(item.id));
  actions.updateCreatePost({
    series: newSeries,
    tags: newTags,
  });
};

const handleValidateSeriesTagsError = (params: HandleSeriesTagsErrorParams) => {
  const {
    postType, error, onNext, titleAlert,
  } = params || {};
  const {
    seriesNames,
    tagNames,
    seriesIds = [],
    tagIds = [],
  } = error?.meta?.errors || {};

  const removeSeriesTags = () => {
    if (postType === PostType.ARTICLE) {
      removeSeriesTagsArticle(seriesIds, tagIds);
    } else removeSeriesTagsPost(seriesIds, tagIds);
    onNext?.();
  };

  showAlert({
    title: i18next.t(titleAlert || 'article:modal_invalid_series_tags:title'),
    children: (
      <InvalidSeriesTagsContentModal
        seriesNames={seriesNames}
        tagNames={tagNames}
      />
    ),
    cancelBtn: true,
    confirmLabel: i18next.t('common:text_remove'),
    ConfirmBtnComponent: Button.Danger,
    onConfirm: removeSeriesTags,
    confirmBtnProps: { type: 'ghost' },
  });
};

const handleSeriesTagsError
  = (_set, _get) => (params: HandleSeriesTagsErrorParams) => {
    const { error } = params || {};
    const errorCode = error?.code;
    if (errorCode === ApiErrorCode.Post.ARTICLE_INVALID_PARAM) {
      handleValidateSeriesTagsError(params);
    } else {
      showToastError(error);
    }
  };

export default handleSeriesTagsError;
