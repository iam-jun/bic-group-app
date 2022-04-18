import {ICommentData, IReaction} from '~/interfaces/IPost';
import {put, select} from 'redux-saga/effects';
import {get} from 'lodash';
import postKeySelector from '~/screens/Post/redux/keySelector';
import postActions from '~/screens/Post/redux/actions';

function* addChildCommentToCommentsOfPost({
  postId,
  commentId,
  childComments,
  shouldAddChildrenCount,
}: {
  postId: number;
  commentId: string | number;
  childComments: IReaction[];
  shouldAddChildrenCount?: boolean;
}) {
  const postComments: ICommentData[] = yield select(state =>
    get(state, postKeySelector.commentsByParentId(postId)),
  ) || [];
  for (let i = 0; i < postComments.length; i++) {
    if (postComments[i].id === commentId) {
      const child = postComments[i].child || [];
      const newChild = child.concat(childComments) || [];
      // If manual add comment by create comment, should update children counts
      // Load more children comment do not add children counts
      if (shouldAddChildrenCount) {
        postComments[i].totalReply = (postComments[i].totalReply || 0) + 1;
      }
      postComments[i].child = newChild;
      yield put(
        postActions.updateAllCommentsByParentIdsWithComments({
          id: postId,
          comments: new Array(postComments[i]),
          isMerge: true,
        }),
      );
      return;
    }
  }
}

export default addChildCommentToCommentsOfPost;
