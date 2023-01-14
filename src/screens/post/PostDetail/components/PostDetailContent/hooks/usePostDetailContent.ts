import { useIsFocused } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { useDispatch } from 'react-redux';
import Text from '~/baseComponents/Text';
import APIErrorCode from '~/constants/apiErrorCode';
import { useBaseHook } from '~/hooks';
import { useUserIdAuth } from '~/hooks/auth';
import { useRootNavigation } from '~/hooks/navigation';
import { useKeySelector } from '~/hooks/selector';
import { IAudienceGroup, IPayloadGetPostDetail } from '~/interfaces/IPost';
import { rootSwitch } from '~/router/stack';
import { defaultList, getSectionData } from '~/helpers/post';
import useCommentsStore from '~/store/entities/comments';
import commentsSelector from '~/store/entities/comments/selectors';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import postActions from '~/storeRedux/post/actions';
import postKeySelector from '~/storeRedux/post/keySelector';
import useModalStore from '~/store/modal';

const usePostDetailContent = ({ postId, notificationId, HeaderImageComponent }) => {
  const dispatch = useDispatch();
  const { t } = useBaseHook();
  const { rootNavigation } = useRootNavigation();

  const isInternetReachable = useKeySelector('noInternet.isInternetReachable');

  const isFocused = useIsFocused();

  const internetReachableRef = useRef(true);

  const userId = useUserIdAuth();
  const { showAlert } = useModalStore((state) => state.actions);

  const actor = usePostsStore(useCallback(postsSelector.getActor(postId), [postId]));
  const deleted = usePostsStore(useCallback(postsSelector.getDeleted(postId), [postId]));
  const createdAt = usePostsStore(useCallback(postsSelector.getCreatedAt(postId), [postId]));
  const audience = usePostsStore(useCallback(postsSelector.getAudience(postId), [postId]));
  const commentLeft = usePostsStore(useCallback(postsSelector.getCommentOnlyCount(postId), [postId]));
  const setting = usePostsStore(useCallback(postsSelector.getSetting(postId), [postId]));
  const reported = usePostsStore(useCallback(postsSelector.getReported(postId), [postId]));

  const comments = useCommentsStore(useCallback(commentsSelector.getCommentsByParentId(postId), [postId]));
  const commentError = useKeySelector(postKeySelector.commentErrorCode);

  const commentSectionData = useMemo(() => getSectionData(comments), [comments]);
  const sectionData = deleted || !setting?.canComment ? defaultList : commentSectionData;

  const [refreshing, setRefreshing] = useState(false);
  const [isEmptyContent, setIsEmptyContent] = useState(false);

  const groupIds = useMemo(() => {
    if (isEmpty(audience?.groups)) return '';

    const ids = audience.groups.map((g: IAudienceGroup) => g?.id);
    return ids?.join?.(',');
  }, [audience]);

  const showNotice = (isSetRefreshing?: boolean) => {
    isSetRefreshing && setRefreshing(true);
    setIsEmptyContent(true);
    showAlert({
      HeaderImageComponent,
      title: t('post:deleted_post:title'),
      titleProps: { style: { flex: 1, textAlign: 'center' } },
      cancelBtn: false,
      isDismissible: true,
      onConfirm: () => {
        rootNavigation.canGoBack && rootNavigation.goBack();
      },
      confirmLabel: t('post:deleted_post:button_text'),
      content: t('post:deleted_post:description'),
      contentProps: { style: { textAlign: 'center' } },
      ContentComponent: Text.BodyS,
      buttonViewStyle: { justifyContent: 'center' },
      headerStyle: { marginBottom: 0 },
      onDismiss: () => {
        rootNavigation.canGoBack && rootNavigation.goBack();
      },
    });
    isSetRefreshing && setRefreshing(false);
  };

  const onRefresh = () => {
    if (
      commentError === APIErrorCode.Post.POST_DELETED
      || commentError === APIErrorCode.Post.POST_PRIVACY
    ) {
      showNotice(true);
    } else {
      getPostDetail((loading) => setRefreshing(loading));
    }
  };

  const onPressMarkSeenPost = useCallback(() => {
    dispatch(postActions.putMarkSeenPost({ postId }));
  }, [postId]);

  useEffect(() => {
    onPressMarkSeenPost();
    return () => {
      dispatch(postActions.setCreatePostInitAudiences());
      dispatch(postActions.setCommentErrorCode(false));
    };
  }, []);

  useEffect(
    () => () => {
      if (commentError === APIErrorCode.Post.POST_DELETED) {
        dispatch(postActions.deletePostLocal(postId));
      }
    },
    [commentError],
  );

  useEffect(() => {
    if (!userId) {
      rootNavigation.replace(rootSwitch.authStack);
    }
  }, [isFocused, userId]);

  useEffect(() => {
    internetReachableRef.current = isInternetReachable;
  }, [isInternetReachable]);

  useEffect(() => {
    if (postId && userId && internetReachableRef.current) {
      getPostDetail((loading, success) => {
        if (!loading && !success && internetReachableRef.current) {
          showNotice();
        }
      });
    }
  }, [postId, userId, internetReachableRef]);

  useEffect(() => {
    if (deleted && isFocused) {
      if (notificationId) {
        rootNavigation.goBack();
      } else showNotice();
    }
  }, [deleted, isFocused]);

  useEffect(() => {
    if (reported && isFocused) {
      setTimeout(() => {
        rootNavigation.goBack();
      }, 200);
    }
  }, [reported, isFocused]);

  const getPostDetail = (
    callbackLoading?: (loading: boolean, success: boolean) => void,
  ) => {
    if (userId && postId) {
      const payload: IPayloadGetPostDetail = {
        postId,
        callbackLoading,
        showToast: !!notificationId,
      };
      dispatch(postActions.getPostDetail(payload));
    }
  };

  return {
    isEmptyContent,
    refreshing,

    actor,
    setting,
    deleted,
    createdAt,
    audience,
    commentLeft,
    groupIds,
    comments,
    sectionData,

    onRefresh,
    onPressMarkSeenPost,
  };
};

export default usePostDetailContent;
