import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { differenceWith, isEmpty, isEqual } from 'lodash';
import { Keyboard } from 'react-native';
import {
  validateFiles,
  validateImages,
  validateVideo,
} from '~/screens/Post/CreatePost/helper';
import modalActions from '~/store/modal/actions';
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
import postActions from '~/screens/Post/redux/actions';
import postDataHelper from '~/screens/Post/helper/PostDataHelper';
import { useKeySelector } from '~/hooks/selector';
import postKeySelector from '~/screens/Post/redux/keySelector';
import { useBaseHook } from '~/hooks';
import { getResourceUrl, uploadTypes } from '~/configs/resourceConfig';
import { getMentionsFromContent } from '~/screens/Post/helper/PostUtils';
import { IGetFile } from '~/services/fileUploader';

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

  const initSelectingImagesRef = useRef([]);
  const initGroupsRef = useRef<any>([]);
  const initUsersRef = useRef<any>([]);
  const selectingImages = useKeySelector(postKeySelector.createPost.images);
  const selectingVideo = useKeySelector(postKeySelector.createPost.video);
  const selectingFiles = useKeySelector(postKeySelector.createPost.files);
  const { images, imageUploading } = validateImages(
    selectingImages, t,
  );
  const { video, videoUploading } = validateVideo(
    selectingVideo, t,
  );
  const { files, fileUploading } = validateFiles(
    selectingFiles, t,
  );

  // const [hasVideoProgress, setHasVideoProgress] = useState(videoUploading);

  const tempMentions = useKeySelector('mentionInput.tempSelected') || {};

  let initPostData: IPostActivity = {};

  if (postId) {
    initPostData = useKeySelector(postKeySelector.postById(postId));
  }

  if (draftPostId) {
    const draftPosts = useKeySelector(postKeySelector.draft.posts) || [];
    initPostData = draftPosts?.find((item: IPostActivity) => item?.id === draftPostId);
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

  const isAudienceHasChange = !isEqual(
    initGroupsRef.current, groups,
  )
    || !isEqual(
      initUsersRef.current, users,
    );
  const isImageHasChange = !isEqual(
    selectingImages,
    initSelectingImagesRef.current,
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
  });

  const isEditPost = !!initPostData?.id;
  const isEditPostHasChange = content !== initPostData?.content
    || isImageHasChange
    || isAudienceHasChange;
  const isEditDraftPost = !!initPostData?.id && draftPostId;
  const isSettingsHasChange = initPostData?.setting?.isImportant !== important?.active
    || initPostData?.setting?.importantExpiredAt !== important?.expires_time;

  // Disable button post if loading, empty content, empty audience or edit post but nothing changed
  const disableButtonPost = imageUploading
    || videoUploading
    || fileUploading
    || loading
    || content?.trim?.()?.length === 0
    || chosenAudiences.length === 0
    || (isEditPost
      && !isEditPostHasChange
      && !isEditDraftPost
      && !isSettingsHasChange);

  const clearAutoSaveTimeout = () => {
    clearTimeout(refToastAutoSave?.current);
    clearTimeout(refAutoSave?.current);
    clearTimeout(refStopsTyping?.current);
  };

  useEffect(
    () => {
      if (initAutoSaveDraft) {
        autoSaveDraftPost();
      }
    }, [],
  );

  useEffect(
    () => {
      setPostData({ ...initPostData });
    }, [initPostData?.id],
  );

  useEffect(
    () => {
      debouncedStopsTyping();
    }, [content],
  );

  useEffect(
    () => {
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
              : getResourceUrl(
                uploadTypes.postImage, item?.name,
              ),
          });
        });
        dispatch(postActions.setCreatePostImagesDraft(initImages));
        dispatch(postActions.setCreatePostImages(initImages));
        initSelectingImagesRef.current = initImages;
      }
    }, [initPostData],
  );

  useEffect(
    () => {
      if (initPostData?.id) {
        const initData = {
          content: initPostData?.content || '',
          images: initPostData?.media?.images,
          files: initPostData?.media?.files,
          videos: initPostData?.media?.videos,
        };
        dispatch(postActions.setCreatePostData(initData));

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

        const initImportant = {
          active: !!initPostData?.setting?.isImportant,
          expires_time: initPostData?.setting?.importantExpiredAt,
        };
        const dataDefault = [
          !!initImportant.active
        || !!initImportant.expires_time,
          !!canComment,
          !!canReact,
        ];
        const newCount = dataDefault.filter((i) => !i);

        dispatch(postActions.setCreatePostSettings({
          important: initImportant,
          canComment: initPostData?.setting?.canComment,
          canReact: initPostData?.setting?.canReact,
          count: newCount?.length || 0,
        }));
        dispatch(postActions.setCreatePostCurrentSettings({ important: initImportant }));

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
    }, [initPostData?.id],
  );

  useEffect(
    () => {
      const dataChangeList = [
        isEmpty(differenceWith(
          selectingImages,
          prevData?.current?.selectingImages,
          isEqual,
        )),
        isEmpty(differenceWith(
          chosenAudiences,
          prevData?.current?.chosenAudiences,
          isEqual,
        )),
        isEqual(
          important, prevData?.current?.important,
        ),
        isEqual(
          selectingVideo, prevData?.current?.selectingVideo,
        ),
        isEmpty(differenceWith(
          selectingFiles,
          prevData?.current?.selectingFiles,
          isEqual,
        )),
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
    ],
  );

  useEffect(
    () => {
      debouncedAutoSave();
      return () => {
        clearAutoSaveTimeout();
      };
    }, [isPause],
  );

  const debouncedAutoSave = () => {
    if (!isPause) {
      refAutoSave.current = setTimeout(
        () => {
          setPause(true);
          autoSaveDraftPost();
        }, 5000,
      );
    }
  };

  const debouncedStopsTyping = () => {
    if (isAutoSave && refIsFocus.current) {
      clearTimeout(refStopsTyping?.current);
      refStopsTyping.current = setTimeout(
        () => {
          clearTimeout(refAutoSave?.current);
          autoSaveDraftPost();
        }, 500,
      );
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

    const newMentions = getMentionsFromContent(
      _content, tempMentions,
    );
    const mentions = { ...initPostData?.mentions, ...newMentions };

    const data: IPostCreatePost = {
      audience,
      content: _content,
      media,
      setting,
      mentions,
      isDraft: false,
    };

    return data;
  };

  const autoSaveDraftPost = async () => {
    setPause(true);

    try {
      if ((sIsLoading && !sPostId) || loading) {
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
      const invalidData = !newContent
        && images.length === 0
        && !video
        && chosenAudiences.length < 1
        && !important?.active
        && !sPostId
        && isEmpty(files);

      if (invalidData || !isAutoSave || imageError || videoError || fileError) {
        if (imageError) {
          dispatch(modalActions.showHideToastMessage({
            content: imageError,
            props: { textProps: { useI18n: true }, type: 'error' },
          }));
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

        await postDataHelper.putEditPost(newPayload);
        refIsRefresh.current = true;
      } else if (isEdit && sPostId) {
        console.warn('\x1b[36m🐣️ useCreatePost skip autosave edit post\x1b[0m');
      } else if (!sPostId) {
        setLoading(true);
        data.isDraft = true;
        const resp = await postDataHelper.postCreateNewPost(data);
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
        refToastAutoSave.current = setTimeout(
          () => {
            setShowToastAutoSave(false);
          }, 3000,
        );
      }
    } catch (error) {
      if (!isEdit) {
        dispatch(postActions.setSavingDraftPost(false));
      }
      if (__DEV__) {
        console.error(
          'error: ', error,
        );
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

    const { imageError } = validateImages(
      selectingImages, t,
    );

    if (imageError) {
      dispatch(modalActions.showHideToastMessage({
        content: imageError,
        props: { textProps: { useI18n: true }, type: 'error' },
      }));
      return 'attachmentError';
    }

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
      console.error('\x1b[31m🐣️ useCreatePost handlePressPost must create post from draft \x1b[0m');
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
  };
};

export default useCreatePost;
