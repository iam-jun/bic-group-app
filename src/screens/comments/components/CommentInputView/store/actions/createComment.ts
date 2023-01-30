import { cloneDeep, isEmpty } from 'lodash';
import streamApi from '~/api/StreamApi';
import useMentionInputStore from '~/beinComponents/inputs/MentionInput/store';
import APIErrorCode from '~/constants/apiErrorCode';
import { IPayloadCreateComment, IReaction } from '~/interfaces/IPost';
import useCommentDetailController from '~/screens/comments/CommentDetail/store';
import { getMentionsFromContent } from '~/helpers/post';
import useCommentsStore from '~/store/entities/comments';
import usePostsStore from '~/store/entities/posts';
import showToastError from '~/store/helper/showToastError';
import Store from '~/storeRedux';
import postActions from '~/storeRedux/post/actions';
import ICommentInputState from '../Interface';

const createComment = (_set, get) => async (payload: IPayloadCreateComment) => {
  const {
    localId,
    postId,
    parentCommentId,
    commentData,
    userId,
    preComment,
    onSuccess,
    isCommentLevel1Screen,
    viewMore,
  } = payload || {};
  if (
    !postId
    || !commentData
    || !userId
    || (!commentData?.content
      && isEmpty(commentData?.giphy)
      && isEmpty(commentData?.media?.images)
      && isEmpty(commentData?.media?.files)
      && isEmpty(commentData?.media?.videos))
  ) {
    console.error('\x1b[31m🐣️ saga postCreateNewComment: invalid param\x1b[0m');
    return;
  }

  const { createComment, actions }:ICommentInputState = get() || {};
  try {
    Store.store.dispatch(postActions.putMarkSeenPost({ postId }));
    if (!!createComment?.loading) {
      console.error('\x1b[31m🐣️ saga postCreateNewComment: creating\x1b[0m');
      return;
    }

    actions.setCreateComment({ loading: true });

    // update comments or child comments
    // retrying doesn't need this step
    if (preComment) {
      if (!parentCommentId) {
        useCommentsStore.getState().actions.addToCommentsByParentIdWithComments({
          id: postId,
          commentIds: [preComment.localId.toString()],
          isMerge: true,
        });
        useCommentsStore.getState().actions.addToComments({ ...preComment, id: preComment.localId.toString() });
      } else {
        useCommentsStore.getState().actions.addChildCommentToComment({
          commentId: parentCommentId,
          childComments: new Array(preComment),
          shouldAddChildrenCount: true,
        });
      }
    }
    if (!isCommentLevel1Screen) {
      Store.store.dispatch(postActions.setScrollToLatestItem({ parentCommentId }));
    } else {
      Store.store.dispatch(postActions.setScrollCommentsPosition({ position: 'bottom' }));
    }

    Store.store.dispatch(postActions.setPostDetailReplyingComment());

    // get mentions from temp selected in mention input
    const tempMentions = useMentionInputStore.getState().tempSelected;
    commentData.mentions = getMentionsFromContent(
      commentData?.content,
      tempMentions,
    );

    let resComment;
    if (parentCommentId) {
      const response = await streamApi.postReplyComment({
        postId,
        parentCommentId,
        data: commentData,
      });
      resComment = response?.data;
    } else {
      const response = await streamApi.postNewComment({
        postId,
        data: commentData,
      });
      resComment = response?.data;
    }
    onSuccess?.(); // clear content in text input
    if (!!viewMore && !!parentCommentId) {
      useCommentDetailController.getState().actions.getCommentDetail({ commentId: parentCommentId });
      actions.setCreateComment({ loading: false, content: '' });
      onSuccess?.(); // call second time to make sure content is cleared on low performance device
      return;
    }
    // update comment_count
    const allPosts = usePostsStore.getState().posts || {};
    const newAllPosts = cloneDeep(allPosts);
    const post = newAllPosts[postId] || {};
    post.commentsCount = (post.commentsCount || 0) + 1;
    if (!parentCommentId) {
      const postComments = post?.comments || { meta: { total: 0 } };
      postComments.meta = {
        ...postComments?.meta,
        total: (postComments?.meta?.total || 0) + 1,
      };
      post.comments = postComments;
    }
    newAllPosts[postId] = post;
    usePostsStore.getState().actions.setPosts(newAllPosts);

    // update comments or child comments again when receiving from API
    useCommentsStore.getState().actions.addToComments(resComment);

    useCommentsStore.getState().actions.updateCreatedComment({
      status: 'success',
      localId: localId || preComment?.localId,
      postId,
      resultComment: resComment,
      parentCommentId,
    });

    actions.setCreateComment({ loading: false, content: '' });
    onSuccess?.(); // call second time to make sure content is cleared on low performance device
  } catch (e: any) {
    console.error(
      'create comment err:', JSON.stringify(e),
    );
    if (preComment && !parentCommentId) {
      // retrying doesn't need to update status because status = 'failed' already
      useCommentsStore.getState().actions.updateCreatedComment({
        status: 'failed',
        localId: preComment?.localId,
        postId,
        resultComment: {} as IReaction,
        parentCommentId,
      });
    }
    actions.setCreateComment({ loading: false });
    if (!!parentCommentId && e?.code === APIErrorCode.Post.COMMENT_DELETED) {
      Store.store.dispatch(postActions.setCommentErrorCode(APIErrorCode.Post.COMMENT_DELETED));
      Store.store.dispatch(postActions.removeChildComment({
        localId: preComment?.localId,
        postId,
        parentCommentId,
      }));

      showToastError(e);
    } else if (e?.code === APIErrorCode.Post.POST_DELETED
      || e?.code === APIErrorCode.Post.VALIDATION_ERROR) {
      if (e?.code === APIErrorCode.Post.POST_DELETED) {
        Store.store.dispatch(postActions.setCommentErrorCode(APIErrorCode.Post.POST_DELETED));
      }
      if (parentCommentId) {
        Store.store.dispatch(postActions.removeChildComment({
          localId: preComment?.localId,
          postId,
          parentCommentId,
        }));
      } else {
        Store.store.dispatch(postActions.removeCommentLevel1Deleted({
          postId,
          localId: preComment?.localId,
        }));
      }
      showToastError(e);
    } else {
      showToastError(e);
    }
  }
};

export default createComment;
