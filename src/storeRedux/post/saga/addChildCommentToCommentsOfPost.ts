import { cloneDeep, isEmpty } from 'lodash';
import { ICommentData } from '~/interfaces/IPost';
import useCommentsStore from '~/store/entities/comments';

// eslint-disable-next-line require-yield
function* addChildCommentToCommentsOfPost({
  postId,
  commentId,
  childComments,
  shouldAddChildrenCount,
  meta,
}: {
  postId: string;
  commentId: string | number;
  childComments: ICommentData[];
  shouldAddChildrenCount?: boolean;
  meta?: any;
}) {
  const postComments: ICommentData[] = useCommentsStore.getState().commentsByParentId?.[postId] || [];
  for (let i = 0; i < postComments.length; i++) {
    if (postComments[i].id === commentId) {
      const newPostComments = cloneDeep(postComments[i]);
      const child = postComments[i].child?.list || [];
      const newChild = child.concat(childComments) || [];
      // If manual add comment by create comment, should update children counts
      // Load more children comment do not add children counts
      if (shouldAddChildrenCount) {
        newPostComments.totalReply = (newPostComments.totalReply || 0) + 1;
      }
      if (!isEmpty(meta)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        newPostComments.child.meta = { ...newPostComments?.child?.meta, ...meta };
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      newPostComments.child.list = newChild;

      useCommentsStore.getState().actions.addToCommentsByParentIdWithComments({
        id: postId,
        comments: new Array(newPostComments),
        isMerge: true,
        commentId,
      });
      return;
    }
  }
}

export default addChildCommentToCommentsOfPost;
