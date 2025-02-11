import { isEmpty, isEqual } from 'lodash';
import {
  useEffect, useMemo, useRef, useState,
} from 'react';
import { Keyboard } from 'react-native';

import { useShallow } from '~/store/utils';
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
import {
  getAudienceIdsFromAudienceObject,
  isEmptyContent,
  countWordsFromContent,
} from '~/screens/articles/CreateArticle/helper';
import useCreateArticleStore from '~/screens/articles/CreateArticle/store';
import { getMentionsFromContent } from '~/helpers/post';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import { useBaseHook } from '~/hooks';
import useMyPermissionsStore from '~/store/permissions';

import { rootNavigationRef } from '~/router/refs';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import useDraftArticleStore from '~/screens/YourContent/components/Draft/DraftArticle/store';
import useModalStore from '~/store/modal';
import { PermissionKey } from '~/constants/permissionScheme';
import { PostStatus, PostType } from '~/interfaces/IPost';
import useValidateSeriesTags, { HandleSeriesTagsErrorParams } from '~/components/ValidateSeriesTags/store';
import showToastSuccess from '~/store/helper/showToastSuccess';
import { trackEvent } from '~/services/tracking';
import { TrackingEventContentPublishedProperties } from '~/services/tracking/Interface';
import { TrackingEvent } from '~/services/tracking/constants';
import { isScheduledContent } from '~/components/ScheduleContent/helper';

export interface IHandleSaveOptions {
  isShowLoading?: boolean;
  isNavigateBack?: boolean;
  isShowToast?: boolean;
  shouldValidateSeriesTags?: boolean;
  onSuccess?: () => void;
  titleAlert?: string;
}

const navigation = withNavigation?.(rootNavigationRef);

export interface IUseEditArticle {
  articleId: string;
  handleSaveAudienceError?: (listIdAudiences: string[]) => void;
}

const useCreateArticle = ({ articleId }: IUseEditArticle) => {
  const article = usePostsStore(postsSelector.getPost(articleId, {}));

  const actions = useCreateArticleStore((state) => state.actions);

  const validateSeriesTagsActions = useValidateSeriesTags(
    (state) => state.actions,
  );
  const isValidating = useValidateSeriesTags((state) => state.isValidating);

  const data = useCreateArticleStore((state) => state.data, useShallow) || {};
  const loading = useCreateArticleStore((state) => state.loading);
  const isDraft = useCreateArticleStore((state) => state.isDraft);
  const chooseAudiences = useCreateArticleStore((state) => state.chooseAudiences);
  const { getAudienceListWithNoPermission } = useMyPermissionsStore(
    (state) => state.actions,
  );

  const { showAlert } = useModalStore((state) => state.actions);

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

  const audiencesWithNoPermission = getAudienceListWithNoPermission(
    chooseAudiences,
    PermissionKey.EDIT_OWN_CONTENT_SETTING,
  );
  const disableArticleSettings = chooseAudiences.length === 0 || audiencesWithNoPermission.length > 0;

  const { t } = useBaseHook();

  // auto save for draft article, so no need to check if content is empty
  const isDraftContentUpdated = article.content !== data.content;
  const canAutoSave = isDraft && isDraftContentUpdated;

  const isHasChange = () => {
    // self check at src/screens/articles/CreateArticle/screens/CreateArticleContent/index.tsx
    // const isContentUpdated = article.content !== data.content && !isEmptyContent();
    const isSummaryUpdated = article.summary !== data.summary;
    const isTitleUpdated = article.title !== data.title;
    const isCategoriesUpdated = !isEqual(article.categories, data.categories);
    // self check at src/screens/articles/CreateArticle/screens/CreateArticleAudience/index.tsx
    // const isAudienceUpdated = !isEqual(getAudienceIdsFromAudienceObject(article.audience), data.audience)
    // && !(isEmpty(data.audience?.groupIds) && isEmpty(data.audience?.userIds));
    const isCoverMediaUpdated = article.coverMedia?.id !== data.coverMedia?.id;
    const isSeriesUpdated = !isEqual(article?.series, data.series);
    const isTagsUpdated = !isEqual(article?.tags, data.tags);
    // const isSettingsUpdated = !isEqual(article?.setting, data.setting);

    return (
      isTitleUpdated
      || isSummaryUpdated
      || isCategoriesUpdated
      || isCoverMediaUpdated
      || isSeriesUpdated
      || isTagsUpdated
      // || isSettingsUpdated
    );
  };

  const isValidForSave = () => {
    // self check at src/screens/articles/CreateArticle/screens/CreateArticleContent/index.tsx
    // const isContentUpdated = article.content !== data.content && !isEmptyContent();
    const isSummaryUpdated = article.summary !== data.summary;
    const isTitleUpdated
      = article.title !== data.title && !isEmpty(data.title?.trim());
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
    // const isSettingsUpdated = !isEqual(article?.setting, data.setting);

    return (
      isTitleUpdated
      || isSummaryUpdated
      || isCategoriesUpdated
      || isCoverMediaUpdated
      || isSeriesUpdated
      || isTagsUpdated
      // || isSettingsUpdated
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

  const initSettings = (settings) => {
    const notExpired = new Date().getTime() < new Date(settings?.importantExpiredAt).getTime();
    const isNever = settings?.isImportant && !settings?.importantExpiredAt;

    const initData = {
      isImportant: (!!notExpired || isNever) && settings?.isImportant,
      importantExpiredAt: !!notExpired ? settings?.importantExpiredAt : null,
      // canShare: settings?.canShare,
      canReact: settings?.canReact,
      canComment: settings?.canComment,
    };

    return initData;
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
      scheduledAt,
      setting,
      wordCount,
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
      setting: initSettings(setting),
      wordCount,
    };
    actions.setData(data);

    const isDraft = status === PostStatus.DRAFT;
    const isSchedule = isScheduledContent(status);
    actions.setIsDraft(isDraft);
    actions.setIsSchedule(isSchedule);
    if (isSchedule) {
      actions.setScheduledAt(scheduledAt || '');
    }

    // setChooseAudiences for handle article settings
    actions.setChooseAudiences(audienceObject?.groups);
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
    actions.setWordCount(countWordsFromContent(newContent));
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
      handleSave({
        isNavigateBack: false,
        isShowLoading: false,
        isShowToast: false,
      });
      showToastAutoSave();
    }, 500);
  };

  const debounceTypingConstantly = () => {
    if (!refTypingConstantly.current) {
      refTypingConstantly.current = setTimeout(() => {
        handleSave({
          isNavigateBack: false,
          isShowLoading: false,
          isShowToast: false,
        });
        refTypingConstantly.current = null;
        showToastAutoSave();
      }, 5000);
    }
  };

  useEffect(() => {
    // only auto save for draft article
    if (canAutoSave) {
      debounceStopTyping();
      debounceTypingConstantly();
    }
  }, [data.content]);

  const validateSeriesTags = (
    onSuccess: (response) => void,
    onError: (error) => void,
  ) => {
    const dataUpdate = useCreateArticleStore.getState().data;
    const validateParams: IParamsValidateSeriesTags = {
      groups: dataUpdate?.audience?.groupIds || [],
      series: dataUpdate?.series?.map?.((item) => item.id) || [],
      tags: dataUpdate?.tags?.map?.((item) => item.id) || [],
    };
    validateSeriesTagsActions.validateSeriesTags(validateParams, onSuccess, onError);
  };

  const handleSeriesTagsError = (params: HandleSeriesTagsErrorParams) => {
    validateSeriesTagsActions.handleSeriesTagsError(params);
  };

  const handleSave = (options?: IHandleSaveOptions) => {
    Keyboard.dismiss();
    const {
      isNavigateBack = true,
      isShowLoading = true,
      isShowToast = true,
      shouldValidateSeriesTags,
      onSuccess,
      titleAlert,
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
      onSuccess,
    } as IPayloadPutEditArticle;

    if (shouldValidateSeriesTags) {
      const onSuccess = () => actions.putEditArticle(putEditArticleParams);
      const onError = (error) => {
        handleSeriesTagsError({
          error,
          onNext: () => handleSave(options),
          titleAlert,
          postType: PostType.ARTICLE,
        });
      };
      validateSeriesTags(onSuccess, onError);
    } else {
      actions.putEditArticle(putEditArticleParams);
    }
  };

  const handlePublish = () => {
    if (!validButtonPublish) return;

    const goToArticleDetail = () => {
      navigation.replace(articleStack.articleDetail, { articleId: data.id });
    };

    const onHandleSaveErrorDone = () => handleSave({
      isNavigateBack: false,
      isShowLoading: true,
      isShowToast: false,
      onSuccess: () => handlePublish(),
    });

    const payload: IPayloadPublishDraftArticle = {
      draftArticleId: data.id,
      onSuccess: (res) => {
        // tracking event
        const eventContentPublishedProperties: TrackingEventContentPublishedProperties = {
          content_type: PostType.ARTICLE,
          important: !!data?.setting?.isImportant,
        };
        trackEvent({ event: TrackingEvent.CONTENT_PUBLISHED, properties: eventContentPublishedProperties });

        goToArticleDetail();
        showToastSuccess(res);
      },
      onError: (error) => handleSeriesTagsError({
        error,
        onNext: onHandleSaveErrorDone,
        postType: PostType.ARTICLE,
      }),
    };
    useDraftArticleStore.getState().actions.publishDraftArticle(payload);
  };

  const handleBack = (shouldShowAlert = false) => {
    if (isChanged || shouldShowAlert) {
      Keyboard.dismiss();
      showAlert({
        title: t('discard_alert:title'),
        content: t('discard_alert:content'),
        cancelBtn: true,
        cancelLabel: t('common:btn_discard'),
        confirmLabel: t('common:btn_stay_here'),
        onCancel: () => {
          initEditStoreData();
          navigation.goBack();
        },
      });
      return;
    }
    navigation.goBack();
  };

  return {
    loading,
    isValidating,
    isShowToastAutoSave,
    enableButtonSave,
    validButtonPublish,
    title: data.title,
    content: data.content,
    groupIds,
    disableArticleSettings,
    audiencesWithNoPermission,
    handleTitleChange,
    handleContentChange,
    handleSave,
    handleBack,
    handleAudiencesChange,
    handlePublish,
    validateSeriesTags,
    handleSeriesTagsError,
  };
};

export default useCreateArticle;
