import { isEqual, orderBy } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { Keyboard } from 'react-native';
import useMentionInputStore from '~/beinComponents/inputs/MentionInput/store';
import IMentionInputState from '~/beinComponents/inputs/MentionInput/store/Interface';
import { getMentionsFromContent } from '~/helpers/post';
import { useBaseHook } from '~/hooks';
import {
  IAudience,
  IPayloadPutEditPost,
  IPostCreatePost,
  PostStatus,
} from '~/interfaces/IPost';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import showAlert from '~/store/helper/showAlert';
import { MAXIMUM_TAGS } from '../constanst';
import {
  isEqualById, validateFiles, validateImages, validateVideo,
} from '../helper';
import useCreatePostStore from '../store';
import useLinkPreview from './useLinkPreview';

export type SavePostParams = Partial<IPayloadPutEditPost> & {
  isToastAutoSave?: boolean;
};

const navigation = withNavigation?.(rootNavigationRef);

export const useSavePost = () => {
  const { t } = useBaseHook();
  const [isAutoSave, setIsAutoSave] = useState(false);
  const [isShowToastAutoSave, setShowToastAutoSave] = useState<boolean>(false);

  const refStopTyping = useRef(null);
  const refTypingConstantly = useRef(null);

  const createPostStoreActions = useCreatePostStore((state) => state.actions);
  const postStoreActions = usePostsStore((state) => state.actions);
  const createPostData = useCreatePostStore((state) => state.createPost);
  const createPostTempData = useCreatePostStore((state) => state.tempData);
  const prevUpdateData = useCreatePostStore((state) => state.prevUpdate);
  const loading = useCreatePostStore((state) => state.loading);
  const tempMentions = useMentionInputStore(
    (state: IMentionInputState) => state.tempSelected,
  );
  const { linkPreview } = useLinkPreview();
  const { lstLinkPreview } = linkPreview;
  const currentLinkPreview = lstLinkPreview[lstLinkPreview.length - 1];
  const isLoadingLinkPreview = currentLinkPreview?.isLoading || false;

  const {
    id,
    content,
    images: selectingImages,
    video: selectingVideo,
    files: selectingFiles,
    important,
    // canComment,
    // canReact,
    chosenAudiences,
    tags,
    series,
  } = createPostData;

  const { tags: tempSelectedTags, series: tempSelectedSeries } = createPostTempData;

  const post = usePostsStore(postsSelector.getPost(id, {}));

  const isEditPost = post?.status === PostStatus.PUBLISHED;
  const isEditDraftPost = post?.status === PostStatus.DRAFT;

  const users: any[] = [];
  const groups: any[] = [];
  chosenAudiences.forEach((selected: IAudience) => {
    if (selected.type === 'user') {
      users.push(selected.id);
    } else {
      groups.push(selected.id);
    }
  });
  const audience = { groupIds: groups, userIds: users };

  const { images, imageUploading, imageError } = validateImages(
    selectingImages,
    t,
  );
  const { video, videoUploading, videoError } = validateVideo(
    selectingVideo,
    t,
  );
  const { files, fileUploading, fileError } = validateFiles(selectingFiles, t);

  const isChanged = () => {
    const dataChangeList = [
      isEqual(
        JSON.stringify(selectingImages),
        JSON.stringify(prevUpdateData?.images),
      ),
      isEqual(
        orderBy(chosenAudiences, 'id'),
        orderBy(prevUpdateData?.chosenAudiences, 'id'),
      ),
      isEqual(important, prevUpdateData?.important),
      isEqual(selectingVideo, prevUpdateData?.video),
      isEqual(
        orderBy(selectingFiles, 'id'),
        orderBy(prevUpdateData?.files, 'id'),
      ),
      isEqual(linkPreview, prevUpdateData?.linkPreview),
      isEqualById(
        tags,
        prevUpdateData?.tags,
      ),
      isEqualById(
        series,
        prevUpdateData?.series,
      ),
    ];
    const hasChange = dataChangeList.filter((i) => !i);

    return hasChange.length > 0;
  };

  // const isSettingsHasChange
  //   = post?.setting?.isImportant !== important?.active
  //   || post?.setting?.importantExpiredAt !== important?.expiresTime
  //   || post?.setting?.canComment !== canComment
  //   || post?.setting?.canReact !== canReact;

  const isEditPostHasChange
    = content !== post?.content || isChanged();
    // || isSettingsHasChange;

  const isSelectedTagsHasChange = !isEqualById(
    tempSelectedTags,
    tags,
  );

  const isEmptyData = content?.trim?.()?.length === 0 && images.length === 0 && !video && files.length === 0;

  const enableButtonSaveTags = tags?.length <= MAXIMUM_TAGS && isSelectedTagsHasChange;

  const enableButtonSaveSeries = !isEqualById(
    tempSelectedSeries,
    series,
  );

  // Disable button post if loading, empty content, empty audience or edit post but nothing changed
  const disableButtonPost
    = loading
    || imageUploading
    || videoUploading
    || fileUploading
    || !!fileError
    || isEmptyData
    || chosenAudiences.length === 0
    || isLoadingLinkPreview
    || (isEditPost && !isEditPostHasChange && !isEditDraftPost);

  const startAutoSave = () => {
    setIsAutoSave(true);
  };

  const updatePrevUpdate = () => {
    createPostStoreActions.updatePrevUpdate({
      images: selectingImages,
      chosenAudiences,
      important,
      video: selectingVideo,
      files: selectingFiles,
      linkPreview,
      tags,
      series,
    });
  };

  const prepareData = () => {
    const _video = {
      id: video?.id,
      name: video?.fileName || video?.name,
      thumbnails: video?.thumbnails || [],
      ...(video?.url ? {} : { status: 'waiting_process' }),
    };

    const media = {
      images,
      videos: video?.id ? [_video] : [],
      files,
    };

    // const setting: any = {};
    // setting.isImportant = important?.active || false;
    // setting.importantExpiredAt = important?.expiresTime || null;
    // setting.canComment = canComment;
    // setting.canReact = canReact;
    // setting.canShare = true;

    const newMentions = getMentionsFromContent(content, tempMentions);

    const linkPreview = currentLinkPreview
      ? {
        url: currentLinkPreview.url,
        domain: currentLinkPreview.domain,
        title: currentLinkPreview.title,
        image: currentLinkPreview.image,
        description: currentLinkPreview.description,
      }
      : null;

    const tagsIds = tags?.map?.((item) => item?.id) || [];
    const seriesIds = series?.map?.((item) => item?.id) || [];

    const data: IPostCreatePost = {
      audience,
      content,
      media,
      // setting,
      mentions: newMentions,
      linkPreview,
      tags: tagsIds,
      series: seriesIds,
    };

    return data;
  };

  const canSave = () => {
    const invalidData
      = !id
      && !content
      && images.length === 0
      && !video
      && chosenAudiences.length < 1
      && files.length === 0;

    if (
      loading
      || isLoadingLinkPreview
      || imageUploading
      || videoUploading
      || fileUploading
      || invalidData
      || imageError
      || videoError
      || fileError
    ) {
      return false;
    }

    return true;
  };

  const savePost = async (params: SavePostParams) => {
    if (!canSave()) return false;

    const {
      disableNavigate,
      replaceWithDetail = true,
      isToastAutoSave,
      isPublish = true,
      isCreatingNewPost,
      onSuccess,
    } = params;
    const data = prepareData();
    const newPayload: IPayloadPutEditPost = {
      id,
      data,
      disableNavigate,
      replaceWithDetail,
      onRetry: () => savePost(params),
      isPublish,
      isCreatingNewPost,
      onSuccess,
    };
    try {
      if (isToastAutoSave) {
        showToastAutoSave();
      }
      updatePrevUpdate();
      await postStoreActions.putEditPost(newPayload);
    } catch {
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (isAutoSave && isChanged()) {
      savePost({
        isToastAutoSave: true,
        isPublish: !isEditDraftPost,
      });
    }
  }, [
    JSON.stringify(selectingImages),
    JSON.stringify(chosenAudiences),
    JSON.stringify(selectingVideo),
    important,
    JSON.stringify(selectingFiles),
    JSON.stringify(linkPreview),
    JSON.stringify(tags),
    JSON.stringify(series),
  ]);

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
      savePost({
        isToastAutoSave: true,
        isPublish: !isEditDraftPost,
      });
    }, 500);
  };

  const debounceTypingConstantly = () => {
    if (!refTypingConstantly.current) {
      refTypingConstantly.current = setTimeout(() => {
        savePost({
          isToastAutoSave: true,
          isPublish: !isEditDraftPost,
        });
        refTypingConstantly.current = null;
      }, 5000);
    }
  };

  useEffect(() => {
    if (isAutoSave) {
      debounceStopTyping();
      debounceTypingConstantly();
    }
  }, [content]);

  const saveSelectedTags = () => {
    createPostStoreActions.updateCreatePost({
      tags: tempSelectedTags,
    });
  };

  const saveSelectedSeries = () => {
    createPostStoreActions.updateCreatePost({
      series: tempSelectedSeries,
    });
  };

  const handleBackWhenSelecting = (isShowAlert: boolean) => {
    if (isShowAlert) {
      Keyboard.dismiss();
      showAlert({
        title: t('discard_alert:title'),
        content: t('discard_alert:content'),
        cancelBtn: true,
        cancelLabel: t('common:btn_discard'),
        confirmLabel: t('common:btn_stay_here'),
        onCancel: () => {
          navigation.goBack();
        },
      });
      return;
    }
    navigation.goBack();
  };

  const handleBackWhenSelectingTags = () => {
    handleBackWhenSelecting(enableButtonSaveTags);
  };

  const handleBackWhenSelectingSeries = () => {
    handleBackWhenSelecting(enableButtonSaveSeries);
  };

  return {
    isShowToastAutoSave,
    disableButtonPost,
    enableButtonSaveTags,
    enableButtonSaveSeries,
    isEditPostHasChange,
    startAutoSave,
    prepareData,
    savePost,
    saveSelectedTags,
    saveSelectedSeries,
    handleBackWhenSelectingTags,
    handleBackWhenSelectingSeries,
  };
};

export default useSavePost;
