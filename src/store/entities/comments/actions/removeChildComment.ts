import { ICommentData, IRemoveChildComment } from '~/interfaces/IPost';
import ICommentsState from '~/store/entities/comments/Interface';

const removeChildComment = (_set, get) => (payload: IRemoveChildComment) => {
  const { localId, postId, parentCommentId } = payload || {};
  if (!localId || !postId || !parentCommentId) return;

  const { comments, actions }: ICommentsState = get();

  const parentComment = comments[parentCommentId];

  if (parentComment?.child?.list) {
    const newList = parentComment.child.list?.filter?.((cmt: ICommentData) => cmt?.localId !== localId);
    parentComment.child.list = [...newList];
    parentComment.totalReply = Math.max((parentComment.totalReply || 0) - 1, 0);
  }

  const newComments = {
    ...comments,
    [parentCommentId]: {
      ...parentComment,
    },
  };

  actions.setComments(newComments);
};

export default removeChildComment;
