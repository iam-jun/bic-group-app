import { cloneDeep } from 'lodash';
import { ICommentData, IReaction } from '~/interfaces/IPost';
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
    status, localId, postId, resultComment, parentCommentId,
  } = payload;
  const { commentsByParentId, actions }: ICommentsState = get() || {};
  const postComments = cloneDeep(commentsByParentId?.[postId]) || [];
  let newPostComments = [];
  if (parentCommentId) {
    // find parent comment
    const parentCommentPosition = postComments.findIndex((item: ICommentData) => item.id === parentCommentId);
    // find and update target reply comment
    const listChild = postComments[parentCommentPosition]?.child?.list || [];
    const targetPosition = listChild.findIndex((item: ICommentData) => item?.localId === localId);
    listChild[targetPosition] = {
      ...listChild[targetPosition],
      ...resultComment,
      status,
    };
    newPostComments = postComments.map((item: ICommentData, index: number) => (
      index === parentCommentPosition ? { ...item, child: { ...item?.child, list: listChild } } : item));
  } else {
    newPostComments = postComments.map((item: ICommentData) => (
      item?.localId === localId ? { ...item, ...resultComment, status } : item));
  }
  actions.setCommentsByParentId({ ...commentsByParentId, [postId]: [...newPostComments] });
};

export default updateCreatedComment;
