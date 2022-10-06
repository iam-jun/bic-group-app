import { ICommentData } from '~/interfaces/IPost';
import ICommentsState from '~/store/entities/comments/Interface';

const addToCommentsByParentId = (set, get) => (payload: {[x: string]: ICommentData[]}) => {
  const { commentsByParentId, actions }: ICommentsState = get() || {};
  const newCommentsByParentId = { ...commentsByParentId, ...payload };
  actions.setCommentsByParentId(newCommentsByParentId);
};

export default addToCommentsByParentId;
