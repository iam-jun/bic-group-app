import { isEmpty } from 'lodash';
import { useEffect } from 'react';
import appConfig from '~/configs/appConfig';
import { getResourceUrl, uploadTypes } from '~/configs/resourceConfig';
import { PermissionKey } from '~/constants/permissionScheme';
import { useBaseHook } from '~/hooks';
import { IFilePicked } from '~/interfaces/common';
import { ICreatePostParams, PostStatus } from '~/interfaces/IPost';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import useMyPermissionsStore from '~/store/permissions';
import { IGetFile } from '~/store/uploader';
import {
  getTotalFileSize, validateFiles, validateImages, validateVideo,
} from '../helper';
import useCreatePostStore, { CreatePost } from '../store';
import useLinkPreview from './useLinkPreview';
import useSavePost from './useSavePost';

type UseCreatePostParams = {
  screenParams: ICreatePostParams;
};

export const useCreatePost = (params: UseCreatePostParams) => {
  const { screenParams } = params || {};
  const { postId } = screenParams || {};

  const { t } = useBaseHook();

  const post = usePostsStore(postsSelector.getPost(postId, {}));

  const isEditPost = post?.status === PostStatus.PUBLISHED;
  const isEditDraftPost = post?.status === PostStatus.DRAFT;

  const createPostData = useCreatePostStore((state) => state.createPost);
  const createPostStoreActions = useCreatePostStore((state) => state.actions);

  const {
    linkPreview,
    debounceHandleLinkPreview,
    handleLinkPreview,
    onCloseLinkPreview,
    loadLinkPreview,
  } = useLinkPreview();
  const {
    isShowToastAutoSave, startAutoSave, disableButtonPost, isEditPostHasChange, savePost, publishPost,
  } = useSavePost();

  const {
    images: selectingImages,
    video: selectingVideo,
    files: selectingFiles,
    isInitDone,
    chosenAudiences,
  } = createPostData;

  const { images } = validateImages(selectingImages, t);
  const { video } = validateVideo(selectingVideo, t);
  const { files } = validateFiles(selectingFiles, t);

  const { totalFiles, totalSize } = getTotalFileSize(files);

  const { getAudienceListWithNoPermission } = useMyPermissionsStore((state) => state.actions);
  const audienceListWithNoPermission = getAudienceListWithNoPermission(
    chosenAudiences,
    PermissionKey.EDIT_POST_SETTING,
  );
  const shouldDisablePostSettings = audienceListWithNoPermission.length === chosenAudiences.length;

  const shouldDisableButtonsCreatePostFooter = () => {
    const buttonsDisabled = {
      imageDisabled: false,
      videoDisabled: false,
      fileDisabled: false,
      settingDisabled: shouldDisablePostSettings,
    };

    if (video) {
      buttonsDisabled.videoDisabled = true;
      buttonsDisabled.imageDisabled = true;
      buttonsDisabled.fileDisabled = true;
    } else if (images?.length > 0) {
      buttonsDisabled.videoDisabled = true;
      buttonsDisabled.fileDisabled = true;
    } else if (files?.length > 0) {
      buttonsDisabled.videoDisabled = true;
      buttonsDisabled.imageDisabled = true;
    }

    if (
      totalFiles === appConfig.maxFiles
    || totalSize >= appConfig.totalFileSize
    ) {
      buttonsDisabled.fileDisabled = true;
    }

    return buttonsDisabled;
  };

  const disableButtonsCreatePostFooter = shouldDisableButtonsCreatePostFooter();

  const initImages = () => {
    // handle selected, uploaded post's image
    const initImgs: any = [];
    post?.media?.images?.forEach((item) => {
      initImgs.push({
        id: item?.id,
        fileName: item?.origin_name || item?.name,
        file: {
          name: item?.origin_name || item?.name,
          filename: item?.origin_name || item?.name,
          width: item?.width || 0,
          height: item?.height || 0,
        },
        url: item?.name?.includes('http')
          ? item.name
          : getResourceUrl(uploadTypes.postImage, item?.name),
      });
    });
    return initImgs.reverse();
  };

  const initChosenAudience = () => {
    const initChosenAudiences: any = [];
    post?.audience?.groups?.forEach?.((group) => {
      initChosenAudiences.push({
        ...group,
        type: 'group',
      });
    });
    post?.audience?.users?.forEach?.((user) => {
      initChosenAudiences.push({
        ...user,
        type: 'user',
      });
    });
    return initChosenAudiences;
  };

  const initSettings = () => {
    const notExpired
      = new Date().getTime()
      < new Date(post?.setting?.importantExpiredAt).getTime();
    const initImportant = {
      active: !!notExpired && post?.setting?.isImportant,
      expiresTime: !!notExpired ? post?.setting?.importantExpiredAt : null,
    };
    const dataDefault = [
      !!notExpired || initImportant?.active,
      !post?.setting?.canComment,
      !post?.setting?.canReact,
    ];
    const newCount = dataDefault.filter((i) => !!i);

    return {
      important: initImportant,
      canComment: post?.setting?.canComment,
      canReact: post?.setting?.canReact,
      count: newCount?.length || 0,
    };
  };

  const initDataStore = () => {
    const {
      id, content, media, linkPreview,
    } = post;

    const linkPreviewPost = linkPreview;
    const additionalLinkPreview = linkPreviewPost ? [linkPreviewPost] : [];
    handleLinkPreview(content || '', additionalLinkPreview);

    const init: Partial<CreatePost> = {
      id,
      images: initImages(),
      content: content || '',
      chosenAudiences: initChosenAudience(),
      ...initSettings(),
      video: media?.videos?.[0],
      files: media?.files || [],
      isInitDone: true,
    };

    createPostStoreActions.updateCreatePost(init);
  };

  useEffect(() => {
    if (!isEmpty(post) && !isEmpty(post?.id) && !isInitDone) {
      initDataStore();
    }
  }, [post]);

  useEffect(() => {
    if (isInitDone && isEditDraftPost) {
      startAutoSave();
    }
  }, [isInitDone]);

  const handleChangeContent = (text: string) => {
    createPostStoreActions.updateCreatePost({
      content: text,
    });
    debounceHandleLinkPreview(text);
  };

  const handleUploadVideoSuccess = (file: IGetFile) => {
    createPostStoreActions.updateCreatePost({
      video: file,
    });
  };

  const handleUploadFileSuccess = (file: IGetFile) => {
    const filename = file?.name;
    const newFiles = selectingFiles.map((fileItem: IFilePicked) => (fileItem.name === filename ? file : fileItem));
    createPostStoreActions.updateCreatePost({
      files: newFiles,
    });
  };

  return {
    images,
    video: selectingVideo,
    files,
    createPostData,
    isEditPost,
    isEditDraftPost,
    handleChangeContent,
    linkPreview,
    onCloseLinkPreview,
    loadLinkPreview,
    handleUploadVideoSuccess,
    handleUploadFileSuccess,
    isShowToastAutoSave,
    disableButtonPost,
    isEditPostHasChange,
    savePost,
    publishPost,
    disableButtonsCreatePostFooter,
    audienceListWithNoPermission,
  };
};

export default useCreatePost;
