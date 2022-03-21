import React, {useEffect, useRef, useState} from 'react';
import {useDispatch} from 'react-redux';

import {validateImages} from '~/screens/Post/CreatePost/helper';
import modalActions from '~/store/modal/actions';
import {
  IAudience,
  IPayloadCreateAutoSave,
  IPayloadPutEditAutoSave,
  IPostActivity,
} from '~/interfaces/IPost';
import postActions from '~/screens/Post/redux/actions';
import postDataHelper from '~/screens/Post/helper/PostDataHelper';
import {useKeySelector} from '~/hooks/selector';
import postKeySelector from '~/screens/Post/redux/keySelector';
import {useBaseHook} from '~/hooks';

const useCreatePost = ({
  postId,
  draftPostId,
  createFromGroupId,
  mentionInputRef,
}: any) => {
  const [isPause, setPause] = useState<boolean>(true);
  const [sIsLoading, setLoading] = React.useState<boolean>(false);
  const [isShowToastAutoSave, setShowToastAutoSave] = useState<boolean>(false);

  const refAutoSave = useRef<any>();
  const refToastAutoSave = useRef<any>();
  const refStopsTyping = useRef<any>();
  const refIsFocus = useRef<boolean>(false);
  const refIsRefresh = useRef<boolean>(false);

  const dispatch = useDispatch();
  const {t} = useBaseHook();

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
  const selectingImages = useKeySelector(postKeySelector.createPost.images);

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
  const audience = {group_ids: groups, user_ids: users};
  chosenAudiences.map((selected: IAudience) => {
    if (selected.type === 'user') {
      users.push(Number(selected.id));
    } else {
      groups.push(Number(selected.id));
    }
  });

  const [sPostData, setPostData] = React.useState<IPostActivity>({
    ...initPostData,
  });

  const sPostId = sPostData?.id;
  const isEdit = !!(sPostId && !sPostData?.is_draft);
  const isDraftPost = !!(sPostId && sPostData?.is_draft);
  const isNewsfeed = !(initPostData?.id && initPostData?.is_draft);

  const isAutoSave = isDraftPost || !isEdit;

  const clearAutoSaveTimeout = () => {
    clearTimeout(refToastAutoSave?.current);
    clearTimeout(refAutoSave?.current);
    clearTimeout(refStopsTyping?.current);
  };

  useEffect(() => {
    setPostData({...initPostData});
  }, [initPostData?.id]);

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

      const payload: IPayloadCreateAutoSave = {
        data: {
          content: newContent,
          images,
          videos: [],
          files: [],
        },
        audience,
        createFromGroupId,
      };

      if (important?.active) {
        payload.important = {
          active: important?.active,
          expires_time: important?.expires_time,
        };
      }

      if (!isEdit) {
        dispatch(postActions.setSavingDraftPost(true));
      }

      if (isDraftPost && sPostId) {
        const newPayload: IPayloadPutEditAutoSave = {
          id: sPostId,
          data: payload,
        };
        await postDataHelper.putEditPost({
          postId: newPayload?.id,
          data: newPayload?.data,
        });
        refIsRefresh.current = true;
      } else if (isEdit && sPostId) {
        if (__DEV__) console.log('payload: ', payload);
      } else {
        setLoading(true);
        payload.is_draft = true;
        const resp = await postDataHelper.postCreateNewPost(payload);
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

  return {
    initPostData,
    autoSaveDraftPost,
    debouncedStopsTyping,
    isPause,
    setPause,
    clearAutoSaveTimeout,
    refIsRefresh,
    isShowToastAutoSave,
    sPostData,
  };
};

export default useCreatePost;
