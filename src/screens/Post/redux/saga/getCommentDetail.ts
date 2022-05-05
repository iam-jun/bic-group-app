import {
  ICommentData,
  IPayloadGetCommentsById,
  IReaction,
} from '~/interfaces/IPost';
import {call, put} from 'redux-saga/effects';
import postDataHelper from '~/screens/Post/helper/PostDataHelper';
import addChildCommentToCommentsOfPost from '~/screens/Post/redux/saga/addChildCommentToCommentsOfPost';
import postActions from '~/screens/Post/redux/actions';
import showError from '~/store/commonSaga/showError';

function* getCommentDetail({
  payload,
}: {
  type: number;
  payload: IPayloadGetCommentsById;
}): any {
  const {postId, parentId, commentId} = payload || {};
  try {
    // callbackLoading?.(true);
    const response = yield call(
      postDataHelper.getCommentDetail,
      commentId,
      payload,
    );
    const {actor, comment, childs} = response;
    if (!!comment && childs?.list?.length > 0) {
      const newComment = {...comment, child: childs.list, meta: childs.meta};
      const payload = {
        id: comment?.postId,
        comments: [newComment],
        isMerge: false,
        isReplace: true,
      };
      yield put(postActions.updateAllCommentsByParentIdsWithComments(payload));
    }
    // callbackLoading?.(false);
    // if (newList?.length > 0) {
    //   if (commentId) {
    //     //get child comment of comment
    //     yield addChildCommentToCommentsOfPost({
    //       postId: postId,
    //       commentId: commentId,
    //       childComments: newList,
    //     });
    //     yield put(postActions.addToAllComments(newList));
    //   } else {
    //     //get comment of post
    //     const payload = {id: postId, comments: newList, isMerge};
    //     let newAllComments: IReaction[] = [];
    //     newList.map((c: ICommentData) => {
    //       newAllComments.push(c);
    //       newAllComments = newAllComments.concat(c?.child || []);
    //     });
    //     yield put(postActions.addToAllComments(newAllComments));
    //     yield put(
    //       postActions.updateAllCommentsByParentIdsWithComments(payload),
    //     );
    //   }
    // }
  } catch (e) {
    console.log(`\x1b[31m🐣️ saga getCommentsByPostId error: `, e, `\x1b[0m`);
    yield showError(e);
  }
}

export default getCommentDetail;
