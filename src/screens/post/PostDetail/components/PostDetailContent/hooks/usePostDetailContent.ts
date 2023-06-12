import { useIsFocused } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import {
  MutableRefObject, useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import Text from '~/baseComponents/Text';
import APIErrorCode from '~/constants/apiErrorCode';
import { useBaseHook } from '~/hooks';
import { useUserIdAuth } from '~/hooks/auth';
import { useRootNavigation } from '~/hooks/navigation';
import { IAudienceGroup, IPayloadGetPostDetail } from '~/interfaces/IPost';
import { rootSwitch } from '~/router/stack';
import { defaultList, getSectionData } from '~/helpers/post';
import useCommentsStore from '~/store/entities/comments';
import commentsSelector from '~/store/entities/comments/selectors';
import usePostsStore, { IPostsState } from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import useNetworkStore from '~/store/network';
import networkSelectors from '~/store/network/selectors';
import useModalStore from '~/store/modal';
import { Props as IRootNavigation } from '~/router/helper';

const usePostDetailContent = ({
  postId,
  notificationId,
  HeaderImageComponent,
  isReported,
}) => {
  const { t } = useBaseHook();
  const { rootNavigation, goHome } = useRootNavigation();

  const isInternetReachable = useNetworkStore(
    networkSelectors.getIsInternetReachable,
  );

  const isFocused = useIsFocused();

  const internetReachableRef = useRef(true);

  const userId = useUserIdAuth();
  const { showAlert } = useModalStore((state) => state.actions);

  const actor = usePostsStore(
    useCallback(postsSelector.getActor(postId), [postId]),
  );
  const deleted = usePostsStore(
    useCallback(postsSelector.getDeleted(postId), [postId]),
  );
  const createdAt = usePostsStore(
    useCallback(postsSelector.getCreatedAt(postId), [postId]),
  );
  const audience = usePostsStore(
    useCallback(postsSelector.getAudience(postId), [postId]),
  );
  const commentLeft = usePostsStore(
    useCallback(postsSelector.getCommentOnlyCount(postId), [postId]),
  );
  const setting = usePostsStore(
    useCallback(postsSelector.getSetting(postId), [postId]),
  );
  const reported = usePostsStore(
    useCallback(postsSelector.getReported(postId), [postId]),
  );
  const errorContent = usePostsStore(
    useCallback(postsSelector.getErrorContent(postId), [postId]),
  );
  const {
    deletePostLocal,
    putMarkSeenPost,
    getPostDetail: actionGetPostDetail,
    setCommentErrorCode,
  } = usePostsStore((state: IPostsState) => state.actions);

  const comments = useCommentsStore(
    useCallback(commentsSelector.getCommentsByParentId(postId), [postId]),
  );
  const commentError = usePostsStore((state) => state.commentErrorCode);

  const commentSectionData = useMemo(
    () => getSectionData(comments),
    [comments],
  );
  const sectionData
    = deleted || !setting?.canComment ? defaultList : commentSectionData;

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
    putMarkSeenPost({ postId });
  }, [postId]);

  useEffect(() => {
    onPressMarkSeenPost();
    return () => {
      setCommentErrorCode(false);
    };
  }, []);

  useEffect(
    () => () => {
      shouldDeletePostLocal({ commentError, postId, deletePostLocal });
    },
    [commentError],
  );

  useEffect(() => {
    shouldReplace({ userId, rootNavigation });
  }, [isFocused, userId]);

  useEffect(() => {
    internetReachableRef.current = isInternetReachable;
  }, [isInternetReachable]);

  useEffect(() => {
    shouldGetPostDetail({
      userId,
      postId,
      internetReachableRef,
      getPostDetail,
      showNotice,
    });
  }, [postId, userId, internetReachableRef]);

  useEffect(() => {
    shouldGoBackWhenDeletedPost({
      deleted,
      isFocused,
      isReported,
      rootNavigation,
      notificationId,
      goHome,
    });
  }, [deleted, isFocused]);

  useEffect(() => {
    shouldGoBack({ reported, isFocused, rootNavigation });
  }, [reported, isFocused]);

  const getPostDetail = (callbackLoading?: (loading: boolean, success: boolean) => void) => {
    if (userId && postId) {
      const payload: IPayloadGetPostDetail = {
        postId,
        callbackLoading,
        showToast: !!notificationId,
        isReported,
      };
      actionGetPostDetail(payload);
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
    errorContent,

    onRefresh,
    onPressMarkSeenPost,
  };
};

const shouldReplace = (params: { userId: string; rootNavigation: IRootNavigation }) => {
  const { userId, rootNavigation } = params;
  if (!userId) {
    rootNavigation.replace(rootSwitch.authStack);
  }
};

const shouldGetPostDetail = (params: {
  postId: string;
  userId: string;
  internetReachableRef: MutableRefObject<boolean>;
  getPostDetail: (callbackLoading?: (loading: boolean, success: boolean) => void) => void;
  showNotice: () => void;
}) => {
  const {
    postId, userId, internetReachableRef, getPostDetail, showNotice,
  } = params;
  if (postId && userId && internetReachableRef.current) {
    getPostDetail((loading, success) => {
      if (!loading && !success && internetReachableRef.current) {
        showNotice();
      }
    });
  }
};

const shouldGoBack = (params: { reported: boolean; isFocused: boolean; rootNavigation: IRootNavigation }) => {
  const { reported, isFocused, rootNavigation } = params;
  if (reported && isFocused) {
    setTimeout(() => {
      rootNavigation.goBack();
    }, 200);
  }
};

const shouldGoBackWhenDeletedPost = (params: {
  deleted: boolean;
  isFocused: boolean;
  isReported: boolean;
  rootNavigation: IRootNavigation;
  notificationId: string;
  goHome: () => void;
}) => {
  const {
    deleted, isFocused, isReported, rootNavigation, notificationId, goHome,
  } = params;
  if (deleted && isFocused && !isReported) {
    if (notificationId) {
      setTimeout(() => {
        rootNavigation.goBack();
      }, 200);
    } else {
      goHome();
    }
  }
};

const shouldDeletePostLocal = (params: {
  commentError: string;
  deletePostLocal: (postId: string) => void;
  postId: string;
}) => {
  const { commentError, deletePostLocal, postId } = params;
  if (commentError === APIErrorCode.Post.POST_DELETED) {
    deletePostLocal(postId);
  }
};

export default usePostDetailContent;
