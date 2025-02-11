import { isEmpty } from 'lodash';
import { useEffect } from 'react';
import appConfig from '~/configs/appConfig';
import { PermissionKey } from '~/constants/permissionScheme';
import { useBaseHook } from '~/hooks';
import { IFilePicked } from '~/interfaces/common';
import { ICreatePostParams, PostStatus } from '~/interfaces/IPost';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import useLinkPreviewStore from '~/store/linkPreview';
import useMyPermissionsStore from '~/store/permissions';
import { IGetFile } from '~/store/uploader';
import {
  getParamsValidateSeriesTags,
  getTotalFileSize,
  validateFiles,
  validateImages,
  validateVideo,
} from '../helper';
import useCreatePostStore, { CreatePost } from '../store';
import useLinkPreview from './useLinkPreview';
import useSavePost from './useSavePost';
import useValidateSeriesTags, { HandleSeriesTagsErrorParams } from '~/components/ValidateSeriesTags/store';
import { isScheduledContent } from '~/components/ScheduleContent/helper';

type UseCreatePostParams = {
  screenParams?: ICreatePostParams;
};

export const useCreatePost = (params?: UseCreatePostParams) => {
  const { screenParams } = params || {};
  const { postId } = screenParams || {};

  const { t } = useBaseHook();

  const post = usePostsStore(postsSelector.getPost(postId, {}));

  const isEditPost = post?.status === PostStatus.PUBLISHED;
  const isEditDraftPost = post?.status === PostStatus.DRAFT;
  const isSchedule = isScheduledContent(post?.status);

  const createPostData = useCreatePostStore((state) => state.createPost);
  const isLoadPostDetailDone = useCreatePostStore((state) => state.isLoadPostDetailDone);
  const createPostStoreActions = useCreatePostStore((state) => state.actions);
  const validateSeriesTagsActions = useValidateSeriesTags(
    (state) => state.actions,
  );
  const isValidating = useValidateSeriesTags((state) => state.isValidating);

  const {
    linkPreview,
    debounceHandleLinkPreview,
    handleLinkPreview,
    onCloseLinkPreview,
    loadLinkPreview,
  } = useLinkPreview();
  const {
    isShowToastAutoSave,
    startAutoSave,
    disableButtonPost,
    disableButtonScheduledPost,
    enableButtonSaveTags,
    enableButtonSaveSeries,
    isEditPostHasChange,
    prepareData,
    savePost,
    saveSelectedTags,
    saveSelectedSeries,
    handleBackWhenSelectingTags,
    handleBackWhenSelectingSeries,
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

  const { getAudienceListWithNoPermission } = useMyPermissionsStore(
    (state) => state.actions,
  );
  const audienceListWithNoPermission = getAudienceListWithNoPermission(
    chosenAudiences,
    PermissionKey.EDIT_OWN_CONTENT_SETTING,
  );
  const shouldDisablePostSettings
    = audienceListWithNoPermission.length > 0;

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
        url: item?.url,
      });
    });
    return initImgs;
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

    const isNever = post?.setting?.isImportant && !post?.setting?.importantExpiredAt;

    const initImportant = {
      active: (!!notExpired || isNever) && post?.setting?.isImportant,
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
      id, content, media, linkPreview, tags, series, scheduledAt,
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
      tags: tags || [],
      series: series || [],
      isInitDone: true,
    };
    createPostStoreActions.updateCreatePost(init);

    const currentLinkPreviewState = useLinkPreviewStore.getState();
    const currentLinkPreview = {
      lstLinkPreview: currentLinkPreviewState.lstLinkPreview,
      lstRemovedLinkPreview: currentLinkPreviewState.lstRemovedLinkPreview,
    };
    createPostStoreActions.updatePrevUpdate({
      images: init.images,
      chosenAudiences: init.chosenAudiences,
      important: init.important,
      video: init.video,
      files: init.files,
      linkPreview: currentLinkPreview,
      tags: tags || [],
      series: series || [],
    });
    createPostStoreActions.setScheduledAt(scheduledAt || '');
  };

  useEffect(() => {
    // need to get detail of the post for full data before editing
    if (!isLoadPostDetailDone && postId) {
      createPostStoreActions.getPostDetail(postId);
    }
  }, [isLoadPostDetailDone, postId]);

  useEffect(() => {
    if (!isEmpty(post) && !isEmpty(post?.id) && isLoadPostDetailDone && !isInitDone) {
      initDataStore();
    }
  }, [post, isLoadPostDetailDone, isInitDone]);

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

  const validateSeriesTags = (
    onSuccess: (response) => void,
    onError: (error) => void,
  ) => {
    const dataUpdate = useCreatePostStore.getState().createPost;
    const params = getParamsValidateSeriesTags(dataUpdate.chosenAudiences);
    validateSeriesTagsActions.validateSeriesTags(params, onSuccess, onError);
  };

  const handleSeriesTagsError = (params: HandleSeriesTagsErrorParams) => {
    validateSeriesTagsActions.handleSeriesTagsError(params);
  };

  return {
    images,
    video: selectingVideo,
    files,
    createPostData,
    isEditPost,
    isEditDraftPost,
    isSchedule,
    isValidating,
    handleChangeContent,
    linkPreview,
    onCloseLinkPreview,
    loadLinkPreview,
    handleUploadVideoSuccess,
    handleUploadFileSuccess,
    isShowToastAutoSave,
    disableButtonPost,
    disableButtonScheduledPost,
    enableButtonSaveTags,
    enableButtonSaveSeries,
    isEditPostHasChange,
    prepareData,
    savePost,
    disableButtonsCreatePostFooter,
    audienceListWithNoPermission,
    saveSelectedTags,
    saveSelectedSeries,
    handleBackWhenSelectingTags,
    handleBackWhenSelectingSeries,
    validateSeriesTags,
    handleSeriesTagsError,
  };
};

export default useCreatePost;
