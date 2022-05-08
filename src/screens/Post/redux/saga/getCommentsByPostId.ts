import {
  ICommentData,
  IPayloadGetCommentsById,
  IReaction,
} from '~/interfaces/IPost';
import {call, put, select} from 'redux-saga/effects';
import postDataHelper from '~/screens/Post/helper/PostDataHelper';
import addChildCommentToCommentsOfPost from '~/screens/Post/redux/saga/addChildCommentToCommentsOfPost';
import postActions from '~/screens/Post/redux/actions';
import showError from '~/store/commonSaga/showError';

function* getCommentsByPostId({
  payload,
}: {
  type: number;
  payload: IPayloadGetCommentsById;
}): any {
  const {
    postId,
    parentId: commentId,
    isMerge,
    callbackLoading,
    idGT,
  } = payload || {};
  try {
    callbackLoading?.(true);
    const response = yield call(postDataHelper.getCommentsByPostId, payload);
    const {list: newList, meta} = response;
    callbackLoading?.(false);
    if (newList?.length > 0) {
      if (commentId) {
        //get child comment of comment
        yield addChildCommentToCommentsOfPost({
          postId: postId,
          commentId: commentId,
          childComments: newList,
          meta: !!idGT
            ? {hasPreviousPage: meta?.hasPreviousPage}
            : {hasNextPage: meta?.hasNextPage},
        });
        yield put(postActions.addToAllComments(newList));
      } else {
        //get comment of post
        const payload = {id: postId, comments: newList, isMerge};
        let newAllComments: IReaction[] = [];
        newList.map((c: ICommentData) => {
          newAllComments.push(c);
          newAllComments = newAllComments.concat(c?.child?.list || []);
        });
        const allPosts = yield select(state => state?.post?.allPosts) || {};
        const newAllPosts = {...allPosts};
        const post = newAllPosts[postId] || {};
        post.comments.meta.hasNextPage = response?.meta?.hasNextPage;
        newAllPosts[postId] = {...post};

        yield put(postActions.addToAllComments(newAllComments));
        yield put(
          postActions.updateAllCommentsByParentIdsWithComments(payload),
        );
        yield put(postActions.setAllPosts(newAllPosts));
      }
    }
  } catch (e) {
    console.log(`\x1b[31m🐣️ saga getCommentsByPostId error: `, e, `\x1b[0m`);
    callbackLoading?.(false);
    yield showError(e);
  }
}

export default getCommentsByPostId;
