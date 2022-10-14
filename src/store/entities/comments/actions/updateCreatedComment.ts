import { IReaction } from '~/interfaces/IPost';
import ICommentsState from '~/store/entities/comments/Interface';

export interface IPayloadUpdateCreatedComment {
  localId?: string | number[];
  status: 'pending' | 'success' | 'failed';
  postId: string;
  resultComment: IReaction;
  parentCommentId?: string;
}

const updateCreatedComment = (set, get) => (payload: IPayloadUpdateCreatedComment) => {
  // update pre-comment with data receiving from API
  const {
    localId, postId, resultComment, parentCommentId,
  } = payload;
  const { commentsByParentId, comments, actions }: ICommentsState = get() || {};
  if (parentCommentId) {
    const parentComment = comments[parentCommentId];
    const currentChild = parentComment?.child?.list?.slice(0, -1);

    delete comments[localId?.toString?.()];
    const newComments = {
      ...comments,
      [parentCommentId]: {
        ...parentComment,
        child: { ...parentComment.child, list: [...currentChild, resultComment] },
      },
    };
    actions.setComments(newComments);
  } else {
    delete comments[localId?.toString?.()];
    const newComments = { ...comments, [resultComment.id]: resultComment };
    actions.setComments(newComments);

    const postComments = commentsByParentId[postId];
    const newPostComments = postComments.slice(0, -1);
    newPostComments.push(resultComment.id);
    actions.setCommentsByParentId({ ...commentsByParentId, [postId]: newPostComments });
  }
};

export default updateCreatedComment;
