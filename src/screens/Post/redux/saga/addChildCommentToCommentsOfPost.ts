import {IReaction} from '~/interfaces/IPost';
import {put, select} from 'redux-saga/effects';
import {get} from 'lodash';
import postKeySelector from '~/screens/Post/redux/keySelector';
import {sortComments} from '~/screens/Post/helper/PostUtils';
import postActions from '~/screens/Post/redux/actions';

function* addChildCommentToCommentsOfPost({
  postId,
  commentId,
  childComments,
  shouldAddChildrenCount,
}: {
  postId: string;
  commentId: string | number;
  childComments: IReaction[];
  shouldAddChildrenCount?: boolean;
}) {
  const postComments: IReaction[] = yield select(state =>
    get(state, postKeySelector.commentsByParentId(postId)),
  ) || [];
  for (let i = 0; i < postComments.length; i++) {
    if (postComments[i].id === commentId) {
      const latestChildren = postComments[i].latest_children || {};
      const oldChildComments = latestChildren.comment || [];
      const newChildComments = oldChildComments.concat(childComments) || [];
      latestChildren.comment = sortComments(newChildComments);
      // If manual add comment by create comment, should update children counts
      // Load more children comment do not add children counts
      if (shouldAddChildrenCount) {
        const childrenCounts = postComments[i].children_counts || {};
        childrenCounts.comment = (childrenCounts.comment || 0) + 1;
        postComments[i].children_counts = childrenCounts;
      }
      postComments[i].latest_children = latestChildren;
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
