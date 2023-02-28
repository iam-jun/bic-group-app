import { differenceWith, isEmpty, isEqual } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import useMentionInputStore from '~/beinComponents/inputs/MentionInput/store';
import IMentionInputState from '~/beinComponents/inputs/MentionInput/store/Interface';
import { getMentionsFromContent } from '~/helpers/post';
import { useBaseHook } from '~/hooks';
import {
  IAudience,
  IPayloadPublishDraftPost,
  IPayloadPutEditPost,
  IPostCreatePost,
  PostStatus,
} from '~/interfaces/IPost';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import showToast from '~/store/helper/showToast';
import { validateFiles, validateImages, validateVideo } from '../helper';
import useCreatePostStore from '../store';
import useLinkPreview from './useLinkPreview';

type SavePostParams = Partial<IPayloadPutEditPost> & {
  isToastAutoSave?: boolean;
  isShowMessageSuccess?: boolean;
};

export const useSavePost = () => {
  const { t } = useBaseHook();
  const [isAutoSave, setIsAutoSave] = useState(false);
  const [isShowToastAutoSave, setShowToastAutoSave] = useState<boolean>(false);

  const refStopTyping = useRef(null);
  const refTypingConstantly = useRef(null);

  const createPostStoreActions = useCreatePostStore((state) => state.actions);
  const postStoreActions = usePostsStore((state) => state.actions);
  const createPostData = useCreatePostStore((state) => state.createPost);
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
    canComment,
    canReact,
    chosenAudiences,
  } = createPostData;

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
      isEmpty(
        differenceWith(
          chosenAudiences,
          prevUpdateData?.chosenAudiences,
          isEqual,
        ),
      ),
      isEqual(important, prevUpdateData?.important),
      isEqual(selectingVideo, prevUpdateData?.video),
      isEmpty(
        differenceWith(
          selectingFiles,
          prevUpdateData?.files,
          isEqual,
        ),
      ),
      isEqual(linkPreview, prevUpdateData?.linkPreview),
    ];
    const hasChange = dataChangeList.filter((i) => !i);

    return hasChange.length > 0;
  };

  const isSettingsHasChange
    = post?.setting?.isImportant !== important?.active
    || post?.setting?.importantExpiredAt !== important?.expiresTime
    || post?.setting?.canComment !== canComment
    || post?.setting?.canReact !== canReact;

  const isEditPostHasChange
    = content !== post?.content || isChanged() || isSettingsHasChange;

  const isEmptyData = content?.trim?.()?.length === 0 && images.length === 0 && !video && files.length === 0;

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

    const setting: any = {};
    setting.isImportant = important?.active;
    setting.importantExpiredAt = important?.expiresTime || null;
    setting.canComment = canComment;
    setting.canReact = canReact;

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

    const data: IPostCreatePost = {
      audience,
      content,
      media,
      setting,
      mentions: newMentions,
      linkPreview,
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
      isShowMessageSuccess = true,
      isShowLoading = true,
    } = params;
    const data = prepareData();
    const newPayload: IPayloadPutEditPost = {
      id,
      data,
      disableNavigate,
      replaceWithDetail,
      onRetry: () => savePost(params),
      msgSuccess: isShowMessageSuccess && 'post:text_edit_post_success',
      isShowLoading,
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

  const publishPost = async () => {
    const isSuccess = await savePost({
      disableNavigate: true,
      isShowMessageSuccess: false,
      isShowLoading: false,
    });
    if (isSuccess) {
      const payload: IPayloadPublishDraftPost = {
        draftPostId: id,
        replaceWithDetail: true,
        onSuccess: () => {
          showToast({ content: 'post:draft:text_draft_post_published' });
        },
      };
      createPostStoreActions.postPublishDraftPost(payload);
    }
  };

  useEffect(() => {
    if (isAutoSave && isChanged()) {
      savePost({
        disableNavigate: true,
        isToastAutoSave: true,
        isShowMessageSuccess: false,
        isShowLoading: false,
      });
    }
  }, [
    JSON.stringify(selectingImages),
    JSON.stringify(chosenAudiences),
    JSON.stringify(selectingVideo),
    important,
    JSON.stringify(selectingFiles),
    JSON.stringify(linkPreview),
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
        disableNavigate: true,
        isToastAutoSave: true,
        isShowMessageSuccess: false,
        isShowLoading: false,
      });
    }, 500);
  };

  const debounceTypingConstantly = () => {
    if (!refTypingConstantly.current) {
      refTypingConstantly.current = setTimeout(() => {
        savePost({
          disableNavigate: true,
          isToastAutoSave: true,
          isShowMessageSuccess: false,
          isShowLoading: false,
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

  return {
    isShowToastAutoSave,
    disableButtonPost,
    isEditPostHasChange,
    startAutoSave,
    savePost,
    publishPost,
  };
};

export default useSavePost;
