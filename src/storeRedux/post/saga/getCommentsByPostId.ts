import { call } from 'redux-saga/effects';
import {
  ICommentData,
  IPayloadGetCommentsById,
} from '~/interfaces/IPost';
import streamApi from '~/api/StreamApi';
import useCommentsStore from '~/store/entities/comments';
import usePostsStore from '~/store/entities/posts';
import addChildCommentToCommentsOfPost from '~/storeRedux/post/saga/addChildCommentToCommentsOfPost';
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
    const response = yield call(streamApi.getCommentsByPostId, params);
    const { list: newList, meta } = response?.data || {};
    callbackLoading?.(false);

    if (!newList || newList.length === 0) return;

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
      useCommentsStore.getState().actions.addToComments(newList);
    } else {
      // get comment of post
      const payload = { id: postId, comments: newList, isMerge };
      let newAllComments: ICommentData[] = [];
      newList.forEach((c: ICommentData) => {
        newAllComments.push(c);
        newAllComments = newAllComments.concat(c?.child?.list || []);
      });
      const allPosts = usePostsStore.getState().posts || {};
      const newAllPosts = { ...allPosts };
      const post = newAllPosts[postId] || {};
      post.comments.meta.hasNextPage = response?.meta?.hasNextPage;
      newAllPosts[postId] = { ...post };

      useCommentsStore.getState().actions.addToComments(newAllComments);
      useCommentsStore.getState().actions.addToCommentsByParentIdWithComments(payload);
      usePostsStore.getState().actions.setPosts(newAllPosts);
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
