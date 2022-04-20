import React, {useEffect, useRef, useState} from 'react';
import {useDispatch} from 'react-redux';

import {validateImages} from '~/screens/Post/CreatePost/helper';
import modalActions from '~/store/modal/actions';
import {
  IAudience,
  ICreatePostParams,
  IParamGetPostAudiences,
  IParamPutEditPost,
  IPayloadCreatePost,
  IPayloadPutEditDraftPost,
  IPayloadPutEditPost,
  IPostActivity,
  IPostCreatePost,
} from '~/interfaces/IPost';
import postActions from '~/screens/Post/redux/actions';
import postDataHelper from '~/screens/Post/helper/PostDataHelper';
import {useKeySelector} from '~/hooks/selector';
import postKeySelector from '~/screens/Post/redux/keySelector';
import {useBaseHook} from '~/hooks';
import {getResourceUrl, uploadTypes} from '~/configs/resourceConfig';
import {differenceWith, isEmpty, isEqual} from 'lodash';
import {Keyboard} from 'react-native';
import {getMentionsFromContent} from '~/screens/Post/helper/PostUtils';

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

const useCreatePost = ({screenParams, mentionInputRef}: IUseCreatePost) => {
  const dispatch = useDispatch();
  const {t} = useBaseHook();

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
  const {images} = validateImages(selectingImages, t);

  const tempMentions = useKeySelector('mentionInput.tempSelected') || {};

  let initPostData: IPostActivity = {};
  if (postId) {
    initPostData = useKeySelector(postKeySelector.postById(postId));
  }
  if (draftPostId) {
    const draftPosts = useKeySelector(postKeySelector.draft.posts) || [];
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
    count,
  } = createPostData || {};
  const {content} = data || {};

  const users: number[] = [];
  const groups: number[] = [];
  const audience = {groupIds: groups, userIds: users};
  chosenAudiences.map((selected: IAudience) => {
    if (selected.type === 'user') {
      users.push(Number(selected.id));
    } else {
      groups.push(Number(selected.id));
    }
  });

  const isAudienceHasChange =
    !isEqual(initGroupsRef.current, groups) ||
    !isEqual(initUsersRef.current, users);
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
  const isEditPostHasChange =
    content !== initPostData?.content ||
    isImageHasChange ||
    isAudienceHasChange;
  const isEditDraftPost = !!initPostData?.id && draftPostId;

  // Disable button post if loading, empty content, empty audience or edit post but nothing changed
  const disableButtonPost =
    loading ||
    content?.trim?.()?.length === 0 ||
    chosenAudiences.length === 0 ||
    (isEditPost && !isEditPostHasChange && !isEditDraftPost);

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
    setPostData({...initPostData});
  }, [initPostData?.id]);

  useEffect(() => {
    debouncedStopsTyping();
  }, [content]);

  useEffect(() => {
    if (initPostData && (isEditDraftPost || isEditPost)) {
      //get post audience for select audience screen and check audience has changed
      initPostData?.audience?.groups?.map?.(g =>
        initGroupsRef.current.push(Number(g?.id)),
      );
      initPostData?.audience?.users?.map?.(u =>
        initUsersRef.current.push(Number(u?.id)),
      );
      const p: IParamGetPostAudiences = {
        group_ids: initGroupsRef.current.join(','),
      };
      dispatch(postActions.getCreatePostInitAudience(p));

      //handle selected, uploaded post's image
      const initImages: any = [];
      initPostData?.media?.images?.map(item => {
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
      dispatch(postActions.setCreatePostImagesDraft(initImages));
      dispatch(postActions.setCreatePostImages(initImages));
      initSelectingImagesRef.current = initImages;
      prevData.current = {...prevData.current, selectingImages: initImages};
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

      const initChosenAudience: any = [];
      initPostData?.audience?.groups?.map?.(group => {
        initChosenAudience.push({
          id: group?.id,
          type: 'group',
          name: group?.name,
          avatar: group?.icon,
        });
      });
      initPostData?.audience?.users?.map?.(user => {
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
      dispatch(postActions.setCreatePostImportant(initImportant));
      dispatch(
        postActions.setCreatePostCurrentSettings({important: initImportant}),
      );
      prevData.current = {
        ...prevData.current,
        chosenAudiences: initChosenAudience,
        important: initImportant,
      };
    }
  }, [initPostData?.id]);

  useEffect(() => {
    const dataChangeList = [
      isEmpty(
        differenceWith(
          selectingImages,
          prevData?.current?.selectingImages,
          isEqual,
        ),
      ),
      isEmpty(
        differenceWith(
          chosenAudiences,
          prevData?.current?.chosenAudiences,
          isEqual,
        ),
      ),
      isEqual(important, prevData?.current?.important),
    ];
    const newDataChange = dataChangeList.filter(i => !i);
    if (isAutoSave && newDataChange.length > 0) {
      prevData.current = {
        ...prevData.current,
        selectingImages,
        chosenAudiences,
        important,
      };
      autoSaveDraftPost();
    }
  }, [
    JSON.stringify(selectingImages),
    JSON.stringify(chosenAudiences),
    important,
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
    const media = {images, videos: [], files: []};
    const setting: any = {};
    if (important?.active) {
      setting.isImportant = important?.active;
      setting.importantExpiredAt = important?.expires_time;
    }

    const newMentions = getMentionsFromContent(_content, tempMentions);
    const mentions = {...initPostData?.mentions, ...newMentions};

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
      const {imageError, images} = validateImages(selectingImages, t);

      const newContent = mentionInputRef?.current?.getContent?.() || content;

      if (
        (!newContent &&
          images.length === 0 &&
          chosenAudiences.length < 1 &&
          !important?.active &&
          !sPostId) ||
        !isAutoSave ||
        imageError
      ) {
        if (imageError) {
          dispatch(
            modalActions.showHideToastMessage({
              content: imageError,
              props: {textProps: {useI18n: true}, type: 'error'},
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
        await postDataHelper.putEditPost(newPayload);
        refIsRefresh.current = true;
      } else if (isEdit && sPostId) {
        console.log(`\x1b[36m🐣️ useCreatePost skip autosave edit post\x1b[0m`);
      } else {
        setLoading(true);
        data.isDraft = true;
        const resp = await postDataHelper.postCreateNewPost(data);
        refIsRefresh.current = true;
        if (resp?.data) {
          const newData = resp?.data || {};
          setPostData({...newData});
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
      if (__DEV__) console.log('error: ', error);
    }
  };

  const handlePressPost = () => {
    if (loading) {
      return 'loading';
    }

    if (!isEdit) {
      clearAutoSaveTimeout();
    }

    const {imageError, images} = validateImages(selectingImages, t);

    if (imageError) {
      dispatch(
        modalActions.showHideToastMessage({
          content: imageError,
          props: {textProps: {useI18n: true}, type: 'error'},
        }),
      );
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
      //case edit post
      const payload: IPayloadPutEditPost = {
        id: initPostData?.id,
        data,
        replaceWithDetail: replaceWithDetail,
        onRetry: () => handlePressPost(),
      };
      dispatch(postActions.putEditPost(payload));
      result = 'editPost';
    } else {
      console.log(
        `\x1b[31m🐣️ useCreatePost handlePressPost must create post from draft \x1b[0m`,
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
    dispatch(postActions.setCreatePostData({...data, content: text}));
  };

  return {
    refIsRefresh,
    isShowToastAutoSave,
    sPostData,
    createPostData,
    images,
    disableButtonPost,
    isEditPost,
    isEditDraftPost,
    isEditPostHasChange,
    handlePressPost,
    handleChangeContent,
    isNewsfeed,
    content,
  };
};

export default useCreatePost;
