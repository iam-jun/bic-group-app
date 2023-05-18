import { IPayloadAddToAllPost, IRemoveComment } from '~/interfaces/IPost';
import ICommentsState from '~/store/entities/comments/Interface';
import usePostsStore from '../../posts';

const removeCommentDeleted = (_set, get) => (payload: IRemoveComment) => {
  const { postId, commentId, localId } = payload || {};
  if ((!localId || !commentId) && !postId) return;

  const { comments, commentsByParentId, actions }: ICommentsState = get();
  const post = usePostsStore.getState()?.posts?.[postId] || {};
  if (commentId) {
    const comment = comments[commentId];
    post.commentsCount = Math.max((post.commentsCount || 0) - 1 - comment.totalReply, 0);
    const newPostCommentParents = commentsByParentId[postId]?.filter?.((cmtId: string) => cmtId !== commentId);
    actions.setCommentsByParentId({ ...commentsByParentId, [postId]: newPostCommentParents });
  }
  if (localId) {
    post.commentsCount = Math.max((post.commentsCount || 0) - 1, 0);
    const newPostCommentParents = commentsByParentId[postId]?.filter?.((cmtId: string) => cmtId !== localId && !!cmtId);
    actions.setCommentsByParentId({ ...commentsByParentId, [postId]: newPostCommentParents });
  }

  usePostsStore.getState().actions.addToPosts({ data: post } as IPayloadAddToAllPost);
};

export default removeCommentDeleted;
