import { isEmpty } from 'lodash';
import { put, select } from 'redux-saga/effects';
import { IPayloadCreateComment } from '~/interfaces/IPost';
import postActions from '~/screens/Post/redux/actions';
import postDataHelper from '~/screens/Post/helper/PostDataHelper';
import showError from '~/store/commonSaga/showError';
import addChildCommentToCommentsOfPost from '~/screens/Post/redux/saga/addChildCommentToCommentsOfPost';
import { getMentionsFromContent } from '~/screens/Post/helper/PostUtils';
import modalActions from '~/store/modal/actions';
import API_ERROR_CODE from '~/constants/apiErrorCode';

function* postCreateNewComment({
  payload,
}: {
  type: string;
  payload: IPayloadCreateComment;
}): any {
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

  try {
    const creatingComment = yield select(
      (state) => state?.post?.createComment?.loading,
    );
    if (creatingComment) {
      console.error('\x1b[31m🐣️ saga postCreateNewComment: creating\x1b[0m');
      return;
    }

    yield put(postActions.setCreateComment({ loading: true }));

    // update comments or child comments
    // retrying doesn't need this step
    if (preComment) {
      if (!parentCommentId) {
        yield put(
          postActions.updateAllCommentsByParentIdsWithComments({
            id: postId,
            comments: new Array(preComment),
            isMerge: true,
          }),
        );
      } else {
        yield addChildCommentToCommentsOfPost({
          postId,
          commentId: parentCommentId,
          childComments: new Array(preComment),
          shouldAddChildrenCount: true,
        });
      }
    }
    if (!isCommentLevel1Screen) {
      yield put(postActions.setScrollToLatestItem({ parentCommentId }));
    } else {
      yield put(postActions.setScrollCommentsPosition({ position: 'bottom' }));
    }

    yield put(postActions.setPostDetailReplyingComment());

    // get mentions from temp selected in mention input
    const tempMentions = yield select(
      (state) => state?.mentionInput?.tempSelected,
    );
    commentData.mentions = getMentionsFromContent(
      commentData?.content,
      tempMentions,
    );

    let resComment;
    if (parentCommentId) {
      resComment = yield postDataHelper.postReplyComment({
        postId,
        parentCommentId,
        data: commentData,
      });
    } else {
      resComment = yield postDataHelper.postNewComment({
        postId,
        data: commentData,
      });
    }
    onSuccess?.(); // clear content in text input
    if (!!viewMore && !!parentCommentId) {
      yield put(postActions.getCommentDetail({ commentId: parentCommentId }));
      yield put(postActions.setCreateComment({ loading: false, content: '' }));
      onSuccess?.(); // call second time to make sure content is cleared on low performance device
      return;
    }
    // update comment_count
    const allPosts = yield select((state) => state?.post?.allPosts) || {};
    const newAllPosts = { ...allPosts };
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
    yield put(postActions.setAllPosts(newAllPosts));

    // update comments or child comments again when receiving from API

    if (parentCommentId) {
      const allComments = yield select((state) => state?.post?.allComments) || {};
      const newAllComments = { ...allComments };
      const newParentComment = { ...newAllComments[parentCommentId] };
      newParentComment.totalReply = Math.max(
        0,
        newParentComment.totalReply + 1,
      );
      newParentComment.child = {
        list: newParentComment.child?.list?.concat([resComment]) || [],
      };

      yield put(postActions.addToAllComments([resComment, newParentComment]));
    } else {
      yield put(postActions.addToAllComments(resComment));
    }

    yield put(
      postActions.updateCommentAPI({
        status: 'success',
        localId: localId || preComment?.localId,
        postId,
        resultComment: resComment,
        parentCommentId,
      }),
    );

    yield put(postActions.setCreateComment({ loading: false, content: '' }));
    onSuccess?.(); // call second time to make sure content is cleared on low performance device
  } catch (e: any) {
    console.error('err:', JSON.stringify(e));
    if (preComment && !parentCommentId) {
      // retrying doesn't need to update status because status = 'failed' already
      yield put(
        postActions.updateCommentAPI({
          status: 'failed',
          localId: preComment?.localId,
          postId,
          resultComment: {},
          parentCommentId,
        }),
      );
    }
    yield put(postActions.setCreateComment({ loading: false }));
    if (!!parentCommentId && e?.code === API_ERROR_CODE.POST.commentDeleted) {
      yield put(
        postActions.setCommentErrorCode(API_ERROR_CODE.POST.commentDeleted),
      );
      yield put(
        postActions.removeChildComment({
          localId: preComment?.localId,
          postId,
          parentCommentId,
        }),
      );

      yield put(
        modalActions.showHideToastMessage({
          content: 'post:text_comment_deleted',
          toastType: 'banner',
          props: {
            textProps: { useI18n: true },
            type: 'informative',
            leftIcon: 'iconCannotComment',
          },
        }),
      );
    } else if (e?.code === API_ERROR_CODE.POST.postDeleted) {
      yield put(
        postActions.setCommentErrorCode(API_ERROR_CODE.POST.postDeleted),
      );
      if (parentCommentId) {
        yield put(
          postActions.removeChildComment({
            localId: preComment?.localId,
            postId,
            parentCommentId,
          }),
        );
      } else {
        yield put(
          postActions.removeCommentLevel1Deleted({
            postId,
            localId: preComment?.localId,
          }),
        );
      }
      yield put(
        modalActions.showHideToastMessage({
          content: 'post:text_post_deleted',
          toastType: 'banner',
          props: {
            textProps: { useI18n: true },
            type: 'informative',
            leftIcon: 'iconCannotComment',
          },
        }),
      );
    } else {
      yield showError(e);
    }
  }
}

export default postCreateNewComment;
