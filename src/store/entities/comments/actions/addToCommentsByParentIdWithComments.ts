import { IPayloadUpdateCommentsById } from '~/interfaces/IPost';
import ICommentsState from '~/store/entities/comments/Interface';

const addToCommentsByParentIdWithComments = (set, get) => (payload: IPayloadUpdateCommentsById) => {
  const {
    id, commentIds, isMerge,
  } = payload || {};
  const { commentsByParentId, actions }: ICommentsState = get() || {};
  const commentsById = commentsByParentId[id] || [];

  let newComments: string[];
  if (isMerge) {
    newComments = [...new Set([...commentsById, ...commentIds])];
  } else {
    // case for comment from notification
    if (commentIds.length === 1) {
      const filterComments = commentsById.filter((item) => item === commentIds[0]);
      const isExisted = filterComments.length > 0;
      if (isExisted) {
        return;
      }
    }
    // normal case from post detail
    newComments = commentIds;
  }

  actions.setCommentsByParentId({ ...commentsByParentId, [id]: newComments });
};

export default addToCommentsByParentIdWithComments;
