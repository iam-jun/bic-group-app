/* eslint-disable no-template-curly-in-string */
import { isEmpty, isEqual } from 'lodash';
import {
  useEffect, useMemo, useRef, useState,
} from 'react';
import { Keyboard } from 'react-native';

import shallow from 'zustand/shallow';
import useMentionInputStore from '~/beinComponents/inputs/MentionInput/store';
import IMentionInputState from '~/beinComponents/inputs/MentionInput/store/Interface';
import {
  IEditAritcleError,
  IEditArticleAudience,
  IEditArticleData,
  IEditArticleSeries,
  IPayloadPublishDraftArticle,
  IPayloadPutEditArticle,
} from '~/interfaces/IArticle';
import { withNavigation } from '~/router/helper';
import { getAudienceIdsFromAudienceObject, isEmptyContent } from '~/screens/articles/CreateArticle/helper';
import useCreateArticleStore from '~/screens/articles/CreateArticle/store';
import { getMentionsFromContent } from '~/helpers/post';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import Store from '~/storeRedux';
import modalActions from '~/storeRedux/modal/actions';
import { useBaseHook } from '~/hooks';

import { rootNavigationRef } from '~/router/refs';
import Button from '~/baseComponents/Button';
import {
  EditArticleErrorType,
} from '~/constants/article';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import useDraftArticleStore from '~/screens/Draft/DraftArticle/store';
import showToastError from '~/store/helper/showToastError';
import useModalStore from '~/store/modal';

interface IHandleSaveOptions {
  isShowLoading?: boolean;
  isNavigateBack?: boolean;
  isShowToast?: boolean;
  shouldValidateSeriesTags?: boolean;
}

const navigation = withNavigation(rootNavigationRef);

export interface IUseEditArticle {
  articleId: string;
  handleSaveAudienceError?: (listIdAudiences: string[]) => void;
}

const useCreateArticle = ({
  articleId,
  handleSaveAudienceError,
}: IUseEditArticle) => {
  const article = usePostsStore(postsSelector.getPost(articleId, {}));

  const actions = useCreateArticleStore((state) => state.actions);

  const data = useCreateArticleStore((state) => state.data, shallow) || {};
  const loading = useCreateArticleStore((state) => state.loading);
  const isDraft = useCreateArticleStore((state) => state.isDraft);

  const { showToast } = useModalStore((state) => state.actions);

  const [isShowToastAutoSave, setShowToastAutoSave] = useState<boolean>(false);

  const refStopTyping = useRef(null);
  const refTypingConstantly = useRef(null);

  const tempMentions = useMentionInputStore(
    (state: IMentionInputState) => state.tempSelected,
  );

  const groupIds = useMemo(
    () => data.audience?.groupIds?.join?.(','),
    [data.audience],
  );

  const { t } = useBaseHook();

  // auto save for draft article, so no need to check if content is empty
  const isDraftContentUpdated
    = article.content !== data.content;

  const isHasChange = () => {
    // self check at src/screens/articles/CreateArticle/screens/CreateArticleContent/index.tsx
    // const isContentUpdated = article.content !== data.content && !isEmptyContent();
    const isSummaryUpdated = article.summary !== data.summary;
    const isTitleUpdated = article.title !== data.title;
    const isCategoriesUpdated
      = !isEqual(article.categories, data.categories);
    // self check at src/screens/articles/CreateArticle/screens/CreateArticleAudience/index.tsx
    // const isAudienceUpdated = !isEqual(getAudienceIdsFromAudienceObject(article.audience), data.audience)
    // && !(isEmpty(data.audience?.groupIds) && isEmpty(data.audience?.userIds));
    const isCoverMediaUpdated
      = article.coverMedia?.id !== data.coverMedia?.id;
    const isSeriesUpdated = !isEqual(article?.series, data.series);
    const isTagsUpdated = !isEqual(article?.tags, data.tags);

    return (
      isTitleUpdated
      || isSummaryUpdated
      || isCategoriesUpdated
      || isCoverMediaUpdated
      || isSeriesUpdated
      || isTagsUpdated
    );
  };

  const isValidForSave = () => {
    // self check at src/screens/articles/CreateArticle/screens/CreateArticleContent/index.tsx
    // const isContentUpdated = article.content !== data.content && !isEmptyContent();
    const isSummaryUpdated = article.summary !== data.summary;
    const isTitleUpdated = article.title !== data.title && !isEmpty(data.title?.trim());
    const isCategoriesUpdated
      = !isEqual(article.categories, data.categories)
      && !isEmpty(data.categories);
    // self check at src/screens/articles/CreateArticle/screens/CreateArticleAudience/index.tsx
    // const isAudienceUpdated = !isEqual(getAudienceIdsFromAudienceObject(article.audience), data.audience)
    // && !(isEmpty(data.audience?.groupIds) && isEmpty(data.audience?.userIds));
    const isCoverMediaUpdated
      = article.coverMedia?.id !== data.coverMedia?.id
      && !isEmpty(data.coverMedia);
    const isSeriesUpdated = !isEqual(article?.series, data.series);
    const isTagsUpdated = !isEqual(article?.tags, data.tags);

    return (
      isTitleUpdated
      || isSummaryUpdated
      || isCategoriesUpdated
      || isCoverMediaUpdated
      || isSeriesUpdated
      || isTagsUpdated
    );
  };

  const getValidButtonPublish = () => {
    const isTitleValid = !isEmpty(data.title);
    const isContentValid = !isEmptyContent(data.content);
    const isCategoriesValid = !isEmpty(data.categories);
    const isCoverValid = !isEmpty(data.coverMedia);
    const isAudienceValid = !(
      isEmpty(data.audience?.groupIds) && isEmpty(data.audience?.userIds)
    );

    return (
      isTitleValid
      && isContentValid
      && isCategoriesValid
      && isCoverValid
      && isAudienceValid
    );
  };

  const initEditStoreData = () => {
    const {
      id,
      title,
      content,
      audience: audienceObject,
      mentions,
      summary,
      categories,
      coverMedia,
      series,
      tags,
      isDraft,
    } = article;
    const audienceIds: IEditArticleAudience
      = getAudienceIdsFromAudienceObject(audienceObject);
    const data: IEditArticleData = {
      id,
      title,
      content,
      audience: audienceIds,
      mentions,
      summary,
      categories,
      coverMedia,
      series,
      tags,
    };
    actions.setData(data);
    actions.setIsDraft(isDraft);
  };

  useEffect(() => {
    if (!isEmpty(article)) {
      initEditStoreData();
    }
  }, [article]);

  const enableButtonSave = isValidForSave();
  const validButtonPublish = getValidButtonPublish();
  const isChanged = isHasChange();

  const handleContentChange = (newContent: string) => {
    actions.setContent(newContent);
  };

  const handleTitleChange = (newTitle: string) => {
    actions.setTitle(newTitle);
  };

  const updateMentions = () => {
    const newMentions = getMentionsFromContent(data.content, tempMentions);
    actions.setMentions(newMentions);
  };

  const handleAudiencesChange = (newAudiences: IEditArticleAudience) => {
    actions.setAudience(newAudiences);
  };

  const prepareNewSeriesData = (seriesDenied: string[]) => {
    const newSeries = [];
    data.series.forEach((series: IEditArticleSeries) => {
      const isDenied = seriesDenied.findIndex((id) => series?.id === id) > -1;
      if (!isDenied) newSeries.push(series);
    });
    return { ...data, series: newSeries };
  };

  const handleSaveError = ({ type, ids, error }: IEditAritcleError) => {
    if (type === EditArticleErrorType.SERIES_DENIED) {
      const listSeriesName = [];
      ids.forEach((id) => {
        const seriesData = data.series.find(
          (series: IEditArticleSeries) => series?.id === id,
        );
        listSeriesName.push(seriesData.title);
      });
      const text = listSeriesName.join(', ');

      const content = !!handleSaveAudienceError
        ? t('article:remove_audiences_contains_series_content').replace(
          '${series}',
          text,
        )
        : t('article:remove_series_content').replace('${series}', text);

      Store.store.dispatch(
        modalActions.showAlert({
          title: !!handleSaveAudienceError
            ? t('article:remove_audiences_contains_series_title')
            : t('article:remove_series_title'),
          content,
          cancelBtn: true,
          confirmLabel: t('communities:permission:btn_continue'),
          ConfirmBtnComponent: Button.Danger,
          onConfirm: () => actions.putEditArticle(
              {
                articleId,
                data: prepareNewSeriesData(ids),
              } as IPayloadPutEditArticle,
              (data: IEditAritcleError) => handleSaveError(data),
          ),
          confirmBtnProps: { type: 'ghost' },
        }),
      );
    } else {
      Keyboard.dismiss();
      // show toast message received from BE
      if (!handleSaveAudienceError) return showToastError(error);
      handleSaveAudienceError?.(ids);
    }
  };

  const showToastAutoSave = () => {
    setShowToastAutoSave(true);
    setTimeout(() => {
      setShowToastAutoSave(false);
    }, 2000);
  };

  const debounceStopTyping = () => {
    clearTimeout(refStopTyping.current);
    refStopTyping.current = setTimeout(() => {
      clearTimeout(refTypingConstantly.current);
      refTypingConstantly.current = null;
      handleSave({ isNavigateBack: false, isShowLoading: false, isShowToast: false });
      showToastAutoSave();
    }, 500);
  };

  const debounceTypingConstantly = () => {
    if (!refTypingConstantly.current) {
      refTypingConstantly.current = setTimeout(() => {
        handleSave({ isNavigateBack: false, isShowLoading: false, isShowToast: false });
        refTypingConstantly.current = null;
        showToastAutoSave();
      }, 5000);
    }
  };

  useEffect(() => {
    // only auto save for draft article
    if (isDraft && isDraftContentUpdated) {
      debounceStopTyping();
      debounceTypingConstantly();
    }
  }, [data.content]);

  const handleSave = (options?: IHandleSaveOptions) => {
    const { isNavigateBack = true, isShowLoading = true, isShowToast = true } = options || {};
    updateMentions();
    // get data directly from store instead of hook
    // because in case we set store and immediately call handleSave
    // useCreateArticle hook is still not updated at that time
    // so handleSave will hold the old data instead of the new data
    const dataUpdate = useCreateArticleStore.getState().data;
    actions.putEditArticle(
      {
        articleId,
        data: dataUpdate,
        isNavigateBack,
        isShowToast,
        isShowLoading,
      } as IPayloadPutEditArticle,
      (data: IEditAritcleError) => handleSaveError(data),
    );
  };

  const handlePublish = () => {
    if (!validButtonPublish) return;

    const goToArticleDetail = () => {
      navigation.replace(articleStack.articleDetail, { articleId: data.id });
    };

    const payload: IPayloadPublishDraftArticle = {
      draftArticleId: data.id,
      onSuccess: () => {
        showToast({
          content: 'post:draft:text_draft_article_published',
        });
        goToArticleDetail();
      },
      onError: () => {
        // do something
      },
    };
    useDraftArticleStore.getState().actions.publishDraftArticle(payload);
  };

  const handleBack = (showAlert = false) => {
    if (isChanged || showAlert) {
      Keyboard.dismiss();
      Store.store.dispatch(
        modalActions.showAlert({
          title: t('discard_alert:title'),
          content: t('discard_alert:content'),
          cancelBtn: true,
          cancelLabel: t('common:btn_discard'),
          confirmLabel: t('common:btn_stay_here'),
          onCancel: () => {
            initEditStoreData();
            navigation.goBack();
          },
        }),
      );
      return;
    }
    navigation.goBack();
  };

  return {
    loading,
    isShowToastAutoSave,
    enableButtonSave,
    validButtonPublish,
    title: data.title,
    content: data.content,
    groupIds,
    handleTitleChange,
    handleContentChange,
    handleSave,
    handleBack,
    handleAudiencesChange,
    handlePublish,
  };
};

export default useCreateArticle;
