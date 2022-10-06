import ICommentsState from '~/store/entities/comments/Interface';

const commentsSelector = {
  getComment: (id: string) => (state: ICommentsState) => state?.comments?.[id],
  getCommentsByParentId: (parentId: string) => (state: ICommentsState) => state?.commentsByParentId?.[parentId],
};

export default commentsSelector;
