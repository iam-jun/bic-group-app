import i18next from 'i18next';
import React from 'react';

import { Button } from '~/baseComponents';
import ApiErrorCode from '~/constants/apiErrorCode';
import InvalidSeriesTagsContentModal from '~/screens/articles/CreateArticle/components/InvalidSeriesTagsContentModal';
import { ICreateArticleState } from '~/screens/articles/CreateArticle/store';
import showAlert from '~/store/helper/showAlert';
import showToastError from '~/store/helper/showToastError';

const handleValidateSeriesTagsError = (set, get, error: any, onNext: () => void, titleAlert?: string) => {
  const {
    seriesNames, tagNames, seriesIds = [], tagIds = [],
  } = error?.meta?.errors || {};

  const removeSeriesTags = () => {
    const state: ICreateArticleState = get();
    const { data, actions } = state || {};
    const { series, tags } = data || {};
    const newSeries = series?.filter?.((item) => !seriesIds.includes(item.id));
    const newTags = tags?.filter?.((item) => !tagIds.includes(item.id));
    actions.setSeries(newSeries);
    actions.setTags(newTags);
    onNext?.();
  };

  showAlert({
    title: i18next.t(titleAlert || 'article:modal_invalid_series_tags:title'),
    children: <InvalidSeriesTagsContentModal seriesNames={seriesNames} tagNames={tagNames} />,
    cancelBtn: true,
    confirmLabel: i18next.t('common:text_remove'),
    ConfirmBtnComponent: Button.Danger,
    onConfirm: removeSeriesTags,
    confirmBtnProps: { type: 'ghost' },
  });
};

const handleSaveError = (set, get) => (error, onNext, titleAlert) => {
  const errorCode = error?.code;
  if (errorCode === ApiErrorCode.Post.VALIDATION_ERROR) {
    handleValidateSeriesTagsError(set, get, error, onNext, titleAlert);
  } else {
    showToastError(error);
  }
};

export default handleSaveError;
