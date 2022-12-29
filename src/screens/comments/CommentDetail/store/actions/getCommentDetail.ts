import { isEmpty } from 'lodash';

import { IPayloadAddToAllPost, IPayloadGetCommentsById } from '~/interfaces/IPost';
import streamApi from '~/api/StreamApi';
import useCommentsStore from '~/store/entities/comments';
import usePostsStore from '~/store/entities/posts';
import postActions from '~/storeRedux/post/actions';
import APIErrorCode from '~/constants/apiErrorCode';
import showToastError from '~/store/helper/showToastError';
import Store from '~/storeRedux';
import { sortComments } from '~/helpers/post';

const getCommentDetail = (_set, _get) => async (payload: IPayloadGetCommentsById) => {
  const { callbackLoading, commentId } = payload || {};
  try {
    callbackLoading?.(true);
    const response = await
    streamApi.getCommentDetail(commentId, payload.params as any);
    const { actor, list } = response?.data || {};
    if (!!actor && list?.length > 0) {
      const comment = list[0];
      const sortedComments = sortComments(comment?.child?.list || []);
      useCommentsStore.getState().actions.addToComments([...sortedComments, comment]);

      const post = usePostsStore.getState().posts?.[comment?.postId] || {};
      if (isEmpty(post) && comment?.postId) {
        post.id = comment.postId;
        post.actor = actor;
        usePostsStore.getState().actions.addToPosts({ data: post } as IPayloadAddToAllPost);
      }
      useCommentsStore.getState().actions.addToCommentsByParentIdWithComments({
        id: comment?.postId,
        commentIds: [comment.id],
      });
    }
    callbackLoading?.(false);
  } catch (e: any) {
    console.error(
      '\x1b[31m🐣️ saga getCommentDetail error: ', e, '\x1b[0m',
    );
    if (
      e?.code === APIErrorCode.Post.POST_PRIVACY
      || e?.code === APIErrorCode.Post.COPIED_COMMENT_IS_DELETED
      || e?.code === APIErrorCode.Post.POST_DELETED
    ) {
      Store.store.dispatch(postActions.setCommentErrorCode(e.code));
    } else {
      showToastError(e);
    }
    callbackLoading?.(false);
  }
};

export default getCommentDetail;
