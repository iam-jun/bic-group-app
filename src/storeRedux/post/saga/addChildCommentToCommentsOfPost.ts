import { put, select } from 'redux-saga/effects';
import { get, isEmpty } from 'lodash';
import { ICommentData } from '~/interfaces/IPost';
import postKeySelector from '~/storeRedux/post/keySelector';
import postActions from '~/storeRedux/post/actions';

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
  const postComments: ICommentData[] = yield select((state) => get(
    state, postKeySelector
      .commentsByParentId(postId),
  )) || [];
  for (let i = 0; i < postComments.length; i++) {
    if (postComments[i].id === commentId) {
      const child = postComments[i].child?.list || [];
      const newChild = child.concat(childComments) || [];
      // If manual add comment by create comment, should update children counts
      // Load more children comment do not add children counts
      if (shouldAddChildrenCount) {
        postComments[i].totalReply = (postComments[i].totalReply || 0) + 1;
      }
      if (!isEmpty(meta)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        postComments[i].child.meta = { ...postComments[i]?.child?.meta, ...meta };
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      postComments[i].child.list = newChild;

      yield put(postActions.updateAllCommentsByParentIdsWithComments({
        id: postId,
        comments: new Array(postComments[i]),
        isMerge: true,
      }));
      return;
    }
  }
}

export default addChildCommentToCommentsOfPost;
