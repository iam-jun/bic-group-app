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
    newComments = commentIds;
  }

  actions.setCommentsByParentId({ ...commentsByParentId, [id]: newComments });
};

export default addToCommentsByParentIdWithComments;
