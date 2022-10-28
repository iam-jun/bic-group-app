import { cloneDeep, isEmpty } from 'lodash';
import useMentionInputStore from '~/beinComponents/inputs/MentionInput/store';
import { IPayloadCreateComment, IReaction } from '~/interfaces/IPost';
import useCommentsStore from '~/store/entities/comments';
import usePostsStore from '~/store/entities/posts';
import streamApi from '~/api/StreamApi';
import { getMentionsFromContent } from '~/screens/post/helper/postUtils';
import modalActions from '~/storeRedux/modal/actions';
import API_ERROR_CODE from '~/constants/apiErrorCode';
import ICommentInputState from '../Interface';
import Store from '~/storeRedux';
import useCommentDetailController from '~/screens/post/CommentDetail/store';
import postActions from '~/storeRedux/post/actions';
import showError from '~/store/helper/showError';

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
    if (!!parentCommentId && e?.code === API_ERROR_CODE.POST.commentDeleted) {
      Store.store.dispatch(postActions.setCommentErrorCode(API_ERROR_CODE.POST.commentDeleted));
      Store.store.dispatch(postActions.removeChildComment({
        localId: preComment?.localId,
        postId,
        parentCommentId,
      }));

      Store.store.dispatch(modalActions.showHideToastMessage({ content: 'post:text_comment_deleted' }));
    } else if (e?.code === API_ERROR_CODE.POST.postDeleted
      || e?.code === API_ERROR_CODE.POST.postCanNotCommentOrReact) {
      if (e?.code === API_ERROR_CODE.POST.postDeleted) {
        Store.store.dispatch(postActions.setCommentErrorCode(API_ERROR_CODE.POST.postDeleted));
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
      Store.store.dispatch(modalActions.showHideToastMessage({
        content: e?.code === API_ERROR_CODE.POST.postDeleted ? 'post:text_post_deleted' : e?.meta?.message,
      }));
    } else {
      showError(e);
    }
  }
};

export default createComment;
