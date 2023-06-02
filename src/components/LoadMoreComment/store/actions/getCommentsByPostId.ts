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

  const { postId, parentId: commentId, startCursor } = params;

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
        meta : !!startCursor ? {
          hasPreviousPage: meta?.hasPreviousPage,
          startCursor: meta?.startCursor,
        } : {
          hasNextPage: meta?.hasNextPage,
          endCursor: meta?.endCursor,
        },
        isAddFirst: !startCursor,
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
      post.comments.meta.endCursor = meta?.endCursor;
      newAllPosts[postId] = { ...post };

      useCommentsStore.getState().actions.addToComments(newAllComments);
      const postCommentsId = useCommentsStore.getState().commentsByParentId[postId] || [];
      const payload = { id: postId, commentIds: newCommentsId.concat(postCommentsId) };
      useCommentsStore.getState().actions.addToCommentsByParentIdWithComments(payload);
      usePostsStore.getState().actions.setPosts(newAllPosts);
    }
  } catch (e) {
    console.error(
      '\x1b[31m🐣️ getCommentsByPostId error: ', e, '\x1b[0m',
    );
    callbackLoading?.(false);
    showToastError(e);
  }
};

export default getCommentsByPostId;
