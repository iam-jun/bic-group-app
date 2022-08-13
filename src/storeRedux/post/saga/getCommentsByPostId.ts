import { call, put, select } from 'redux-saga/effects';
import {
  ICommentData,
  IPayloadGetCommentsById,
} from '~/interfaces/IPost';
import postDataHelper from '~/api/PostDataHelper';
import addChildCommentToCommentsOfPost from '~/storeRedux/post/saga/addChildCommentToCommentsOfPost';
import postActions from '~/storeRedux/post/actions';
import showError from '~/storeRedux/commonSaga/showError';

function* getCommentsByPostId({
  payload,
}: {
  type: number;
  payload: IPayloadGetCommentsById;
}): any {
  const {
    isMerge,
    params,
    callbackLoading,
  } = payload || {};
  if (!params) return;

  const { postId, parentId: commentId, idGt } = params;

  try {
    callbackLoading?.(true);
    const response = yield call(postDataHelper.getCommentsByPostId, params);
    const { list: newList, meta } = response?.data || {};
    callbackLoading?.(false);
    if (newList?.length > 0) {
      if (commentId && postId) {
        // get child comment of comment
        yield addChildCommentToCommentsOfPost({
          postId,
          commentId,
          childComments: newList,
          meta: idGt
            ? { hasPreviousPage: meta?.hasPreviousPage }
            : { hasNextPage: meta?.hasNextPage },
        });
        yield put(postActions.addToAllComments(newList));
      } else {
        // get comment of post
        const payload = { id: postId, comments: newList, isMerge };
        let newAllComments: ICommentData[] = [];
        newList.forEach((c: ICommentData) => {
          newAllComments.push(c);
          newAllComments = newAllComments.concat(c?.child?.list || []);
        });
        const allPosts = yield select((state) => state?.post?.allPosts) || {};
        const newAllPosts = { ...allPosts };
        const post = newAllPosts[postId] || {};
        post.comments.meta.hasNextPage = response?.meta?.hasNextPage;
        newAllPosts[postId] = { ...post };

        yield put(postActions.addToAllComments(newAllComments));
        yield put(postActions.updateAllCommentsByParentIdsWithComments(payload));
        yield put(postActions.setAllPosts(newAllPosts));
      }
    }
  } catch (e) {
    console.error(
      '\x1b[31m🐣️ saga getCommentsByPostId error: ', e, '\x1b[0m',
    );
    callbackLoading?.(false);
    yield showError(e);
  }
}

export default getCommentsByPostId;
