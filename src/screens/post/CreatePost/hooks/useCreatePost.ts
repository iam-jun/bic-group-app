import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { differenceWith, isEmpty, isEqual } from 'lodash';
import { Keyboard } from 'react-native';
import {
  validateFiles,
  validateImages,
  validateVideo,
} from '~/screens/post/CreatePost/helper';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import modalActions from '~/storeRedux/modal/actions';
import {
  IAudience,
  ICreatePostParams,
  IParamGetPostAudiences,
  IParamPutEditPost,
  IPayloadPutEditDraftPost,
  IPayloadPutEditPost,
  IPostActivity,
  IPostCreatePost,
} from '~/interfaces/IPost';
import postActions from '~/storeRedux/post/actions';
import streamApi from '~/api/StreamApi';
import { useKeySelector } from '~/hooks/selector';
import postKeySelector from '~/storeRedux/post/keySelector';
import { useBaseHook } from '~/hooks';
import { getResourceUrl, uploadTypes } from '~/configs/resourceConfig';
import { getMentionsFromContent } from '~/screens/post/helper/postUtils';
import { IGetFile } from '~/services/fileUploader';
import useDraftPostStore from '../../DraftPost/store';
import IDraftPostState from '../../DraftPost/store/Interface';
import useMentionInputStore from '~/beinComponents/inputs/MentionInput/store';
import IMentionInputState from '~/beinComponents/inputs/MentionInput/store/Interface';
import useLinkPreview from './useLinkPreview';

interface IUseCreatePost {
  screenParams: ICreatePostParams;
  mentionInputRef?: any;
}

export type handlePressPostResultType =
  | 'loading'
  | 'attachmentError'
  | 'editDraft'
  | 'editPost'
  | 'newPost';

const useCreatePost = ({ screenParams, mentionInputRef }: IUseCreatePost) => {
  const dispatch = useDispatch();
  const { t } = useBaseHook();

  const {
    postId,
    draftPostId,
    replaceWithDetail,
    createFromGroupId,
    initAutoSaveDraft,
  } = screenParams;

  const [isPause, setPause] = useState<boolean>(true);
  const [sIsLoading, setLoading] = React.useState<boolean>(false);
  const [isShowToastAutoSave, setShowToastAutoSave] = useState<boolean>(false);

  const refAutoSave = useRef<any>();
  const refToastAutoSave = useRef<any>();
  const refStopsTyping = useRef<any>();
  const refIsFocus = useRef<boolean>(false);
  const refIsRefresh = useRef<boolean>(false);

  const initSelectedLinkPreviewRef = useRef<any>();
  const initSelectingImagesRef = useRef([]);
  const initGroupsRef = useRef<any>([]);
  const initUsersRef = useRef<any>([]);
  const selectingImages = useKeySelector(postKeySelector.createPost.images);
  const selectingVideo = useKeySelector(postKeySelector.createPost.video);
  const selectingFiles = useKeySelector(postKeySelector.createPost.files);
  const {
    linkPreview,
    debounceHandleLinkPreview,
    handleLinkPreview,
    onCloseLinkPreview,
    loadLinkPreview,
  } = useLinkPreview();

  const { lstLinkPreview } = linkPreview;
  const currentLinkPreview = lstLinkPreview[lstLinkPreview.length - 1];
  const isLoadingLinkPreview
    = currentLinkPreview?.isLoading || false;

  const { images, imageUploading } = validateImages(selectingImages, t);
  const { video, videoUploading } = validateVideo(selectingVideo, t);
  const { files, fileUploading } = validateFiles(selectingFiles, t);

  // const [hasVideoProgress, setHasVideoProgress] = useState(videoUploading);

  const tempMentions = useMentionInputStore(
    (state: IMentionInputState) => state.tempSelected,
  );

  let initPostData: IPostActivity = {};

  if (postId) {
    initPostData = usePostsStore(postsSelector.getPost(postId));
  }

  if (draftPostId) {
    const draftPosts
      = useDraftPostStore((state: IDraftPostState) => state.posts) || [];
    initPostData = draftPosts?.find(
      (item: IPostActivity) => item?.id === draftPostId,
    );
  }

  const createPostData = useKeySelector(postKeySelector.createPost.all);
  const {
    loading,
    data,
    chosenAudiences = [],
    important,
    canComment,
    canReact,
    count,
  } = createPostData || {};
  const { content } = data || {};

  const users: any[] = [];
  const groups: any[] = [];
  const audience = { groupIds: groups, userIds: users };
  chosenAudiences.forEach((selected: IAudience) => {
    if (selected.type === 'user') {
      users.push(selected.id);
    } else {
      groups.push(selected.id);
    }
  });

  const isAudienceHasChange
    = !isEqual(initGroupsRef.current, groups)
    || !isEqual(initUsersRef.current, users);
  const isImageHasChange = !isEqual(
    selectingImages,
    initSelectingImagesRef.current,
  );
  const isInitSelectedLinkPreviewChanged = !isEqual(
    initSelectedLinkPreviewRef.current,
    currentLinkPreview,
  );

  const [sPostData, setPostData] = React.useState<IPostActivity>({
    ...initPostData,
  });

  const sPostId = sPostData?.id;
  const isEdit = !!(sPostId && !sPostData?.isDraft);
  const isDraftPost = !!(sPostId && sPostData?.isDraft);
  const isNewsfeed = !(initPostData?.id && initPostData?.isDraft);

  const isAutoSave = isDraftPost || !isEdit;

  const prevData = useRef<any>({
    selectingImages,
    chosenAudiences,
    count,
    important,
    linkPreview,
  });

  const isEditPost = !!initPostData?.id;
  const isEditPostHasChange
    = content !== initPostData?.content
    || isImageHasChange
    || isAudienceHasChange
    || isInitSelectedLinkPreviewChanged;
  const isEditDraftPost = !!initPostData?.id && draftPostId;
  const isSettingsHasChange
    = initPostData?.setting?.isImportant !== important?.active
    || initPostData?.setting?.importantExpiredAt !== important?.expires_time;

  // Disable button post if loading, empty content, empty audience or edit post but nothing changed
  const disableButtonPost
    = imageUploading
    || videoUploading
    || fileUploading
    || content?.trim?.()?.length === 0
    || chosenAudiences.length === 0
    || isLoadingLinkPreview
    || (isEditPost
      && !isEditPostHasChange
      && !isEditDraftPost
      && !isSettingsHasChange);

  const clearAutoSaveTimeout = () => {
    clearTimeout(refToastAutoSave?.current);
    clearTimeout(refAutoSave?.current);
    clearTimeout(refStopsTyping?.current);
  };

  useEffect(() => {
    if (initAutoSaveDraft) {
      autoSaveDraftPost();
    }
  }, []);

  useEffect(() => {
    setPostData({ ...initPostData });
  }, [initPostData?.id]);

  useEffect(() => {
    debouncedStopsTyping();
  }, [content]);

  useEffect(() => {
    if (initPostData && (isEditDraftPost || isEditPost)) {
      // get post audience for select audience screen and check audience has changed
      initPostData?.audience?.groups?.map?.((g) => initGroupsRef.current.push(g?.id));
      initPostData?.audience?.users?.map?.((u) => initUsersRef.current.push(u?.id));
      const p: IParamGetPostAudiences = {
        groupIds: initGroupsRef.current.join(','),
      };
      dispatch(postActions.getCreatePostInitAudience(p));

      // handle selected, uploaded post's image
      const initImages: any = [];
      initPostData?.media?.images?.forEach((item) => {
        initImages.push({
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
      const newInitImages = initImages.reverse();
      dispatch(postActions.setCreatePostImagesDraft(newInitImages));
      dispatch(postActions.setCreatePostImages(newInitImages));
      initSelectingImagesRef.current = initImages;
    }
  }, [initPostData]);

  useEffect(() => {
    if (initPostData?.id) {
      const initData = {
        content: initPostData?.content || '',
        images: initPostData?.media?.images,
        files: initPostData?.media?.files,
        videos: initPostData?.media?.videos,
      };
      dispatch(postActions.setCreatePostData(initData));

      const linkPreviewPost = initPostData?.linkPreview;
      const additionalLinkPreview = linkPreviewPost ? [linkPreviewPost] : [];
      handleLinkPreview(initPostData?.content || '', additionalLinkPreview);

      initSelectedLinkPreviewRef.current = linkPreviewPost;

      const initChosenAudience: any = [];
      initPostData?.audience?.groups?.forEach?.((group) => {
        initChosenAudience.push({
          id: group?.id,
          type: 'group',
          name: group?.name,
          avatar: group?.icon,
        });
      });
      initPostData?.audience?.users?.forEach?.((user) => {
        initChosenAudience.push({
          id: user?.id,
          type: 'user',
          name: user?.fullname,
          avatar: user?.avatar,
        });
      });
      dispatch(postActions.setCreatePostChosenAudiences(initChosenAudience));

      const notExpired
        = new Date().getTime()
        < new Date(initPostData?.setting?.importantExpiredAt).getTime();
      const initImportant = {
        active: !!notExpired,
        expires_time: !!notExpired
          ? initPostData?.setting?.importantExpiredAt
          : null,
      };
      const dataDefault = [
        !!notExpired,
        !initPostData?.setting?.canComment,
        !initPostData?.setting?.canReact,
      ];
      const newCount = dataDefault.filter((i) => !!i);

      dispatch(
        postActions.setCreatePostSettings({
          important: initImportant,
          canComment: initPostData?.setting?.canComment,
          canReact: initPostData?.setting?.canReact,
          count: newCount?.length || 0,
        }),
      );
      dispatch(
        postActions.setCreatePostCurrentSettings({ important: initImportant }),
      );

      const initVideo = initPostData?.media?.videos?.[0];
      dispatch(postActions.setCreatePostVideo(initVideo));
      const initFiles = initPostData?.media?.files;
      dispatch(postActions.setCreatePostFiles(initFiles));

      prevData.current = {
        ...prevData.current,
        chosenAudiences: initChosenAudience,
        important: initImportant,
        selectingVideo: initVideo,
      };
    }
  }, [initPostData?.id]);

  useEffect(() => {
    const dataChangeList = [
      isEqual(
        JSON.stringify(selectingImages),
        JSON.stringify(prevData?.current?.selectingImages),
      ),
      isEmpty(
        differenceWith(
          chosenAudiences,
          prevData?.current?.chosenAudiences,
          isEqual,
        ),
      ),
      isEqual(important, prevData?.current?.important),
      isEqual(selectingVideo, prevData?.current?.selectingVideo),
      isEmpty(
        differenceWith(
          selectingFiles,
          prevData?.current?.selectingFiles,
          isEqual,
        ),
      ),
      isEqual(linkPreview, prevData?.current?.linkPreview),
    ];
    const newDataChange = dataChangeList.filter((i) => !i);
    if (isAutoSave && newDataChange.length > 0 && sPostId) {
      prevData.current = {
        ...prevData.current,
        selectingImages,
        chosenAudiences,
        important,
        selectingVideo,
        selectingFiles,
        linkPreview,
      };
      autoSaveDraftPost();
    }
  }, [
    JSON.stringify(selectingImages),
    JSON.stringify(chosenAudiences),
    selectingVideo?.id,
    selectingVideo?.name,
    important,
    JSON.stringify(selectingFiles),
    JSON.stringify(linkPreview),
  ]);

  useEffect(() => {
    debouncedAutoSave();
    return () => {
      clearAutoSaveTimeout();
    };
  }, [isPause]);

  const debouncedAutoSave = () => {
    if (!isPause) {
      refAutoSave.current = setTimeout(() => {
        setPause(true);
        autoSaveDraftPost();
      }, 5000);
    }
  };

  const debouncedStopsTyping = () => {
    if (isAutoSave && refIsFocus.current) {
      clearTimeout(refStopsTyping?.current);
      refStopsTyping.current = setTimeout(() => {
        clearTimeout(refAutoSave?.current);
        autoSaveDraftPost();
      }, 500);
    }
  };

  const prepareData = () => {
    const _content = mentionInputRef?.current?.getContent?.() || content;
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
    setting.importantExpiredAt = important?.expires_time || 0;
    setting.canComment = canComment;
    setting.canReact = canReact;

    const newMentions = getMentionsFromContent(_content, tempMentions);
    const mentions = { ...initPostData?.mentions, ...newMentions };

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
      content: _content,
      media,
      setting,
      mentions,
      linkPreview,
      isDraft: false,
    };

    return data;
  };

  const autoSaveDraftPost = async () => {
    setPause(true);

    try {
      if ((sIsLoading && !sPostId) || loading || isLoadingLinkPreview) {
        return;
      }
      const { imageError, images, imageUploading } = validateImages(
        selectingImages,
        t,
      );
      const { videoError, video, videoUploading } = validateVideo(
        selectingVideo,
        t,
      );

      const { fileError, files, fileUploading } = validateFiles(
        selectingFiles,
        t,
      );

      const newContent = mentionInputRef?.current?.getContent?.() || content;
      if (imageUploading || videoUploading || fileUploading) {
        console.warn('\x1b[36m🐣️ autoSaveDraftPost uploading media\x1b[0m');
        return;
      }
      const invalidData
        = !newContent
        && images.length === 0
        && !video
        && chosenAudiences.length < 1
        && !important?.active
        && !sPostId
        && isEmpty(files);

      if (invalidData || !isAutoSave || imageError || videoError || fileError) {
        if (imageError) {
          dispatch(
            modalActions.showHideToastMessage({
              content: imageError,
              props: { type: 'error' },
            }),
          );
        }
        return;
      }

      const data = prepareData();

      if (!isEdit) {
        dispatch(postActions.setSavingDraftPost(true));
      }

      if (isDraftPost && sPostId) {
        data.isDraft = true;
        const newPayload: IParamPutEditPost = {
          postId: sPostId,
          data,
        };

        await streamApi.putEditPost(newPayload);
        refIsRefresh.current = true;
      } else if (isEdit && sPostId) {
        console.warn(
          '\x1b[36m🐣️ useCreatePost skip autosave edit post\x1b[0m',
        );
      } else if (!sPostId) {
        setLoading(true);
        data.isDraft = true;
        const resp = await streamApi.postCreateNewPost(data);
        refIsRefresh.current = true;
        if (resp?.data) {
          const newData = resp?.data || {};
          setPostData({ ...newData });
        }
        setLoading(false);
      }
      if (!isEdit) {
        dispatch(postActions.setSavingDraftPost(false));
        setShowToastAutoSave(true);
        clearTimeout(refToastAutoSave?.current);
        refToastAutoSave.current = setTimeout(() => {
          setShowToastAutoSave(false);
        }, 3000);
      }
    } catch (error) {
      if (!isEdit) {
        dispatch(postActions.setSavingDraftPost(false));
      }
      if (__DEV__) {
        console.error('error: ', error);
      }
    }
  };

  const handleUploadVideoSuccess = (file: IGetFile) => {
    dispatch(postActions.setCreatePostVideo(file));
  };

  const handleUploadFileSuccess = (file: IGetFile) => {
    dispatch(postActions.setCreatePostFile(file));
  };

  const handlePressPost = () => {
    if (loading) {
      return 'loading';
    }

    if (!isEdit) {
      clearAutoSaveTimeout();
    }

    const { imageError } = validateImages(selectingImages, t);

    if (imageError) {
      dispatch(
        modalActions.showHideToastMessage({
          content: imageError,
          props: { type: 'error' },
        }),
      );
      return 'attachmentError';
    }

    if (isLoadingLinkPreview) return;

    let result: handlePressPostResultType;
    const data = prepareData();

    if (isDraftPost && sPostId) {
      // case edit draft post or create new post in auto save mode
      const payload: IPayloadPutEditDraftPost = {
        id: sPostId,
        data,
        replaceWithDetail: true,
        publishNow: true,
        createFromGroupId,
      };
      dispatch(postActions.putEditDraftPost(payload));
      result = 'editDraft';
    } else if (isEditPost && initPostData?.id) {
      // case edit post
      const payload: IPayloadPutEditPost = {
        id: initPostData?.id,
        data,
        replaceWithDetail,
        onRetry: () => handlePressPost(),
      };
      dispatch(postActions.putEditPost(payload));
      result = 'editPost';
    } else {
      console.error(
        '\x1b[31m🐣️ useCreatePost handlePressPost must create post from draft \x1b[0m',
      );
      result = 'newPost';
    }
    Keyboard.dismiss();
    return result;
  };

  const handleChangeContent = (text: string) => {
    refIsFocus.current = true;
    if (isAutoSave && isPause) {
      setPause(false);
    }
    dispatch(postActions.setCreatePostData({ ...data, content: text }));
    debounceHandleLinkPreview(text);
  };

  // useEffect(() => {
  //   console.log('useCreatePost videoUploading', videoUploading);
  //   setHasVideoProgress(videoUploading);
  // }, [videoUploading]);

  return {
    refIsRefresh,
    isShowToastAutoSave,
    sPostData,
    createPostData,
    images,
    video: selectingVideo,
    files,
    videoUploading,
    fileUploading,
    disableButtonPost,
    isEditPost,
    isEditDraftPost,
    isEditPostHasChange,
    isNewsfeed,
    content,
    handlePressPost,
    handleChangeContent,
    handleUploadVideoSuccess,
    handleUploadFileSuccess,
    linkPreview,
    onCloseLinkPreview,
    loadLinkPreview,
  };
};

export default useCreatePost;
