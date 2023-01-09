import { isEmpty, isEqual } from 'lodash';
import {
  useEffect, useMemo, useRef, useState,
} from 'react';
import { Keyboard } from 'react-native';

import shallow from 'zustand/shallow';
import useMentionInputStore from '~/beinComponents/inputs/MentionInput/store';
import IMentionInputState from '~/beinComponents/inputs/MentionInput/store/Interface';
import {
  IEditArticleAudience,
  IEditArticleData,
  IParamsValidateSeriesTags,
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
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import useDraftArticleStore from '~/screens/Draft/DraftArticle/store';
import { PostStatus } from '~/interfaces/IPost';

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
}: IUseEditArticle) => {
  const article = usePostsStore(postsSelector.getPost(articleId, {}));

  const actions = useCreateArticleStore((state) => state.actions);

  const data = useCreateArticleStore((state) => state.data, shallow) || {};
  const loading = useCreateArticleStore((state) => state.loading);
  const isDraft = useCreateArticleStore((state) => state.isDraft);

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
      status,
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
    actions.setIsDraft(status === PostStatus.DRAFT);
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
    Keyboard.dismiss();
    const {
      isNavigateBack = true, isShowLoading = true, isShowToast = true, shouldValidateSeriesTags,
    } = options || {};
    updateMentions();

    // get data directly from store instead of hook
    // because in case we set store and immediately call handleSave
    // useCreateArticle hook is still not updated at that time
    // so handleSave will hold the old data instead of the new data
    const dataUpdate = useCreateArticleStore.getState().data;
    const putEditArticleParams = {
      articleId,
      data: dataUpdate,
      isNavigateBack,
      isShowToast,
      isShowLoading,
    } as IPayloadPutEditArticle;

    if (shouldValidateSeriesTags) {
      actions.setLoading(true);
      const validateParams: IParamsValidateSeriesTags = {
        groups: dataUpdate?.audience?.groupIds || [],
        series: dataUpdate?.series?.map?.((item) => item.id) || [],
        tags: dataUpdate?.tags?.map?.((item) => item.id) || [],
      };
      const onSuccess = () => actions.putEditArticle(putEditArticleParams);
      const onError = (error) => {
        actions.setLoading(false);
        actions.handleSaveError(error, () => handleSave(options));
      };
      actions.validateSeriesTags(validateParams, onSuccess, onError);
    } else {
      actions.putEditArticle(putEditArticleParams);
    }
  };

  const handlePublish = () => {
    if (!validButtonPublish) return;

    const goToArticleDetail = () => {
      navigation.replace(articleStack.articleDetail, { articleId: data.id });
    };

    const payload: IPayloadPublishDraftArticle = {
      draftArticleId: data.id,
      onSuccess: () => {
        Store.store.dispatch(
          modalActions.showHideToastMessage({
            content: 'post:draft:text_draft_article_published',
          }),
        );
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
