import ICommentsState from '~/store/entities/comments/Interface';

const commentsSelector = {
  getComment: (id: string) => (state: ICommentsState) => state?.comments?.[id],
  getCommentsByParentId: (parentId: string) => (state: ICommentsState) => {
    const comments = state?.commentsByParentId?.[parentId] || [];
    return comments.map((item) => state?.comments?.[item]);
  },
};

export default commentsSelector;
