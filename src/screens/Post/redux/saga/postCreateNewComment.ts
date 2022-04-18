import {IPayloadCreateComment} from '~/interfaces/IPost';
import {isEmpty} from 'lodash';
import {put, select} from 'redux-saga/effects';
import postActions from '~/screens/Post/redux/actions';
import postDataHelper from '~/screens/Post/helper/PostDataHelper';
import showError from '~/store/commonSaga/showError';
import addChildCommentToCommentsOfPost from '~/screens/Post/redux/saga/addChildCommentToCommentsOfPost';

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
  } = payload || {};
  if (
    !postId ||
    !commentData ||
    !userId ||
    (!commentData?.content &&
      isEmpty(commentData?.media?.images) &&
      isEmpty(commentData?.media?.files) &&
      isEmpty(commentData?.media?.videos))
  ) {
    console.log(`\x1b[31m🐣️ saga postCreateNewComment: invalid param\x1b[0m`);
    return;
  }
  try {
    const creatingComment = yield select(
      state => state?.post?.createComment?.loading,
    );
    if (creatingComment) {
      console.log(`\x1b[31m🐣️ saga postCreateNewComment: creating\x1b[0m`);
      return;
    }

    yield put(postActions.setCreateComment({loading: true}));

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
          postId: postId,
          commentId: parentCommentId,
          childComments: new Array(preComment),
          shouldAddChildrenCount: true,
        });
      }
    }
    if (!isCommentLevel1Screen) {
      yield put(postActions.setScrollToLatestItem({parentCommentId}));
    } else {
      yield put(postActions.setScrollCommentsPosition({position: 'bottom'}));
    }

    onSuccess?.(); // clear content in text input

    yield put(postActions.setPostDetailReplyingComment());

    let resComment;
    if (parentCommentId) {
      resComment = yield postDataHelper.postReplyComment({
        parentCommentId,
        data: commentData,
      });
    } else {
      resComment = yield postDataHelper.postNewComment({
        postId,
        data: commentData,
      });
    }

    //update comment_count
    const allPosts = yield select(state => state?.post?.allPosts) || {};
    const newAllPosts = {...allPosts};
    const post = newAllPosts[postId] || {};
    const newReactionCount = post.reaction_counts || {};
    newReactionCount.comment_count = (newReactionCount.comment_count || 0) + 1;
    newReactionCount.comment =
      !!preComment && !!parentCommentId
        ? newReactionCount.comment
        : newReactionCount.comment + 1;
    post.reaction_counts = {...newReactionCount};
    newAllPosts[postId] = post;
    yield put(postActions.setAllPosts(newAllPosts));

    // update comments or child comments again when receiving from API
    yield put(postActions.addToAllComments(resComment));
    yield put(
      postActions.updateCommentAPI({
        status: 'success',
        // @ts-ignore
        localId: localId || preComment?.localId,
        postId,
        resultComment: resComment,
        parentCommentId: parentCommentId,
      }),
    );

    yield put(postActions.setCreateComment({loading: false, content: ''}));
    onSuccess?.(); // call second time to make sure content is cleared on low performance device
  } catch (e) {
    console.log('err:', e);
    if (preComment) {
      // retrying doesn't need to update status because status = 'failed' already
      yield put(
        postActions.updateCommentAPI({
          status: 'failed',
          localId: preComment.localId,
          postId,
          resultComment: {},
          parentCommentId: parentCommentId,
        }),
      );
    }
    yield put(postActions.setCreateComment({loading: false}));
    yield showError(e);
  }
}

export default postCreateNewComment;
