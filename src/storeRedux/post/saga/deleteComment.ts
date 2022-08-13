import { put, select } from 'redux-saga/effects';
import { get } from 'lodash';
import {
  ICommentData,
  IPayloadDeleteComment,
  IReaction,
} from '~/interfaces/IPost';
import * as modalActions from '~/storeRedux/modal/actions';
import postDataHelper from '~/api/PostDataHelper';
import { IToastMessage } from '~/interfaces/common';
import postActions from '~/storeRedux/post/actions';
import postKeySelector from '~/storeRedux/post/keySelector';

export default function* deleteComment({
  payload,
}: {
  type: string;
  payload: IPayloadDeleteComment;
}): any {
  const { commentId, parentCommentId, postId } = payload;
  if (!commentId) {
    console.error('\x1b[31m🐣️ deleteComment commentId not found\x1b[0m');
    return;
  }
  const allComments = yield select((state) => get(
    state, postKeySelector.allComments,
  )) || {};
  const comment: ICommentData = allComments?.[commentId] || {};
  try {
    yield postDataHelper.deleteComment(commentId);

    // update allCommentsByParentId
    const allCommentsByParentIds = yield select((state) => state?.post?.allCommentsByParentIds) || {};
    let commentsOfPost = allCommentsByParentIds[postId] || [];
    if (parentCommentId) {
      // find comment index
      const pIndex = commentsOfPost?.findIndex?.((cmt: IReaction) => cmt?.id === parentCommentId);
      // remove reply
      if (commentsOfPost?.[pIndex]?.child?.list) {
        commentsOfPost[pIndex].child.list = commentsOfPost[
          pIndex
        ].child?.list?.filter?.((cmt: IReaction) => cmt?.id !== commentId);
      }
      // update comment count
      if (commentsOfPost?.[pIndex]?.totalReply) {
        commentsOfPost[pIndex].totalReply = Math.max(
          (commentsOfPost[pIndex].totalReply || 0) - 1,
          0,
        );
      }
      // update allComments
      const newAllComments = { ...allComments };
      const newParentComment = { ...newAllComments[parentCommentId] };
      newParentComment.totalReply = Math.max(
        0,
        newParentComment.totalReply - 1,
      );
      newParentComment.child.list = newParentComment.child?.list?.filter?.((cmt: IReaction) => cmt?.id !== commentId);

      yield put(postActions.addToAllComments(newParentComment));
    } else {
      // remove comment
      commentsOfPost = commentsOfPost?.filter?.((cmt: IReaction) => cmt?.id !== commentId);
    }
    yield put(postActions.updateAllCommentsByParentIdsWithComments({
      id: postId,
      comments: [...commentsOfPost],
      isMerge: false,
    }));

    // update reaction counts, should minus comment and all reply counts
    const childrenCommentCount = comment?.totalReply || 0;
    const allPosts = yield select((state) => state?.post?.allPosts) || {};
    const newAllPosts = { ...allPosts };
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
    newAllPosts[postId] = { ...post };
    yield put(postActions.setAllPosts(newAllPosts));

    // show toast success
    const toastMessage: IToastMessage = {
      content: 'post:comment:text_delete_comment_success',
      props: {
        textProps: { useI18n: true },
        type: 'informative',
        leftIcon: 'TrashCan',
      },
      toastType: 'normal',
    };
    yield put(modalActions.showHideToastMessage(toastMessage));
  } catch (e) {
    yield put(modalActions.showHideToastMessage({
      content: 'post:comment:text_delete_comment_error',
      props: { textProps: { useI18n: true }, type: 'error' },
      toastType: 'normal',
    }));
  }
}
