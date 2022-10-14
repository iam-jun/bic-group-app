import { IAddChildCommentToComment } from '~/interfaces/IPost';
import ICommentsState from '../Interface';

const addChildCommentToComment = (_set, get) => (payload: IAddChildCommentToComment) => {
  const {
    commentId,
    childComments,
    shouldAddChildrenCount,
    meta = {},
    isAddFirst = false,
  } = payload;
  const { comments, actions }: ICommentsState = get();
  const commentData = { ...comments[commentId] };
  const child = commentData.child?.list || [];
  const newChild = isAddFirst ? [...childComments, ...child] : child.concat(childComments) || [];
  if (shouldAddChildrenCount) {
    commentData.totalReply = (commentData.totalReply || 0) + 1;
  }
  commentData.child.list = newChild;
  const newCommentData = {
    ...commentData,
    child: {
      meta: { ...commentData?.child?.meta, ...meta },
      list: newChild,
    },
  };
  actions.addToComments([newCommentData, ...childComments]);
};

export default addChildCommentToComment;
