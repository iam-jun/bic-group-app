import { cloneDeep } from 'lodash';
import streamApi from '~/api/StreamApi';
import {
  ICommentData,
  IPayloadDeleteComment,
  IReaction,
} from '~/interfaces/IPost';
import useCommentsStore from '~/store/entities/comments';
import usePostsStore from '~/store/entities/posts';
import showToastSuccess from '~/store/helper/showToastSuccess';
import showToastError from '~/store/helper/showToastError';

const deleteComment = (_set, _get) => async (
  payload: IPayloadDeleteComment,
) => {
  const { commentId, parentCommentId, postId } = payload;
  if (!commentId) {
    console.error('\x1b[31m🐣️ deleteComment commentId not found\x1b[0m');
    return;
  }
  const allComments = useCommentsStore.getState().comments || {};
  const comment: ICommentData = allComments?.[commentId] || {};
  try {
    const response = await streamApi.deleteComment(commentId);

    // update allCommentsByParentId
    const allCommentsByParentIds = useCommentsStore.getState().commentsByParentId || {};
    let commentsOfPost = allCommentsByParentIds[postId] || [];
    if (parentCommentId) {
      // update allComments
      const parentComment = { ...allComments[parentCommentId] };
      parentComment.totalReply = Math.max(
        0,
        parentComment.totalReply - 1,
      );
      const newParentCommentChild = parentComment.child?.list?.filter?.((cmt: IReaction) => cmt?.id !== commentId);
      const newParentComment = {
        ...parentComment,
        child: {
          ...parentComment.child,
          list: newParentCommentChild,
        },
      };
      useCommentsStore.getState().actions.addToComments(newParentComment);
    } else {
      // remove comment
      commentsOfPost = commentsOfPost?.filter?.((cmtId: string) => cmtId !== commentId);
    }
    useCommentsStore.getState().actions.addToCommentsByParentIdWithComments({
      id: postId,
      commentIds: [...commentsOfPost],
    });

    // update reaction counts, should minus comment and all reply counts
    const childrenCommentCount = comment?.totalReply || 0;
    const allPosts = usePostsStore.getState().posts || {};
    const newAllPosts = cloneDeep(allPosts);
    const post = newAllPosts[postId] || {};
    post.commentsCount = Math.max(
      0,
      (post.commentsCount || 0) - 1 - childrenCommentCount,
    );

    // update number of comment lv 1
    // if (!parentCommentId) {
    //   if (post.comments?.meta?.total) {
    //     post.comments.meta.total = Math.max(
    //       0,
    //       (post.comments.meta.total || 0) - 1,
    //     );
    //   }
    // }
    usePostsStore.getState().actions.setPosts({ ...newAllPosts, [postId]: post });

    // show toast success
    showToastSuccess(response);
  } catch (e) {
    showToastError(e);
  }
};

export default deleteComment;
