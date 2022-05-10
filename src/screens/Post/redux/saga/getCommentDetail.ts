import {IPayloadGetCommentsById} from '~/interfaces/IPost';
import {call, put} from 'redux-saga/effects';
import postDataHelper from '~/screens/Post/helper/PostDataHelper';
import postActions from '~/screens/Post/redux/actions';
import showError from '~/store/commonSaga/showError';
import API_ERROR_CODE from '~/constants/apiErrorCode';

function* getCommentDetail({
  payload,
}: {
  type: number;
  payload: IPayloadGetCommentsById;
}): any {
  const {callbackLoading, commentId} = payload || {};
  try {
    callbackLoading?.(true);
    const response = yield call(
      //@ts-ignore
      postDataHelper.getCommentDetail,
      commentId,
      payload,
    );
    const {actor, list} = response;
    if (!!actor && list?.length > 0) {
      const comment = list[0];
      const payload = {
        id: comment?.postId,
        commentId: comment?.id,
        comments: [comment],
        isMerge: false,
        isReplace: true,
      };

      const post = {id: comment?.postId, actor: actor};
      yield put(postActions.updateAllCommentsByParentIdsWithComments(payload));
      yield put(postActions.addToAllPosts({data: post}));
    }
    callbackLoading?.(false);
  } catch (e: any) {
    callbackLoading?.(false);
    console.log(`\x1b[31m🐣️ saga getCommentDetail error: `, e, `\x1b[0m`);
    if (
      e?.code === API_ERROR_CODE.POST.postPrivacy ||
      e?.code === API_ERROR_CODE.POST.copiedCommentIsDeleted
    ) {
      yield put(postActions.setCommentErrorCode(e.code));
    } else {
      yield showError(e);
    }
  }
}

export default getCommentDetail;
