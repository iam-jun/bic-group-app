import ICommentsState from '~/store/entities/comments/Interface';

const commentsSelector = {
  getComment: (id: string) => (state: ICommentsState) => state?.comments?.[id],
  getCommentsByParentId: (parentId: string) => (state: ICommentsState) => {
    const comments = state?.commentsByParentId?.[parentId] || [];
    return comments.map((id: string) => state?.comments?.[id]);
  },
};

export default commentsSelector;
