import { cloneDeep } from 'lodash';
import { ICommentData, IPayloadUpdateCommentsById } from '~/interfaces/IPost';
import { sortComments } from '~/screens/post/helper/postUtils';
import ICommentsState from '~/store/entities/comments/Interface';

const addToCommentsByParentIdWithComments = (set, get) => (payload: IPayloadUpdateCommentsById) => {
  const {
    id, comments, isMerge, isReplace, commentId,
  } = payload || {};
  const { commentsByParentId, actions }: ICommentsState = get() || {};
  const commentsById = commentsByParentId[id] || [];

  let newComments: ICommentData[];
  if (isMerge) {
    // newComments = [...new Set([...commentsById, ...comments])];
    newComments = removeDuplicateComments(commentsById, comments, commentId);
  } else if (isReplace) {
    newComments = removeDuplicateComments(commentsById, comments, commentId);

    // newComments = commentsById?.filter?.((item: ICommentData) => item.id != commentId);
    // newComments = [...new Set([...newComments, ...comments])];
  } else {
    newComments = comments;
  }

  const sortedComments = sortComments(newComments);

  actions.setCommentsByParentId({ ...commentsByParentId, [id]: cloneDeep(sortedComments) });
};

const removeDuplicateComments = (comments1: ICommentData[], comments2: ICommentData[], commentId: string) => {
  const newComments = comments1?.filter?.((item: ICommentData) => item.id != commentId);
  return [...new Set([...newComments, ...comments2])];
};

export default addToCommentsByParentIdWithComments;
