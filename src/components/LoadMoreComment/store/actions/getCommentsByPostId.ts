import streamApi from '~/api/StreamApi';
import {
  ICommentData,
  IPayloadGetCommentsById,
} from '~/interfaces/IPost';
import useCommentsStore from '~/store/entities/comments';
import usePostsStore from '~/store/entities/posts';
import showToastError from '~/store/helper/showToastError';

const getCommentsByPostId = (_set, _get) => async (payload: IPayloadGetCommentsById) => {
  const {
    params,
    callbackLoading,
  } = payload || {};
  if (!params) return;

  const { postId, parentId: commentId, idGt } = params;

  try {
    callbackLoading?.(true);
    const response = await streamApi.getCommentsByPostId(params);
    const { list, meta } = response?.data || {};
    callbackLoading?.(false);

    if (!list || list.length === 0) return;

    if (commentId && postId) {
      // get child comment of comment
      useCommentsStore.getState().actions.addChildCommentToComment({
        commentId,
        childComments: list.reverse(),
        meta: !!idGt
          ? { hasPreviousPage: meta?.hasPreviousPage }
          : { hasNextPage: meta?.hasNextPage },
        isAddFirst: !idGt,
      });
    } else {
      // get comment of post
      let newAllComments: ICommentData[] = [];
      const newCommentsId: string[] = [];
      list.reverse().forEach((c: ICommentData) => {
        newAllComments.push(c);
        newAllComments = newAllComments.concat(c?.child?.list || []);
        newCommentsId.push(c.id);
      });
      const allPosts = usePostsStore.getState().posts || {};
      const newAllPosts = { ...allPosts };
      const post = newAllPosts[postId] || {};
      post.comments.meta.hasNextPage = meta?.hasNextPage;
      newAllPosts[postId] = { ...post };

      useCommentsStore.getState().actions.addToComments(newAllComments);
      const postCommentsId = useCommentsStore.getState().commentsByParentId[postId] || [];
      const payload = { id: postId, commentIds: newCommentsId.concat(postCommentsId) };
      useCommentsStore.getState().actions.addToCommentsByParentIdWithComments(payload);
      usePostsStore.getState().actions.setPosts(newAllPosts);
    }
  } catch (e) {
    console.error(
      '\x1b[31m🐣️ saga getCommentsByPostId error: ', e, '\x1b[0m',
    );
    callbackLoading?.(false);
    showToastError(e);
  }
};

export default getCommentsByPostId;
