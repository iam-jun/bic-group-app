import { call, put, select } from 'redux-saga/effects';
import { get, isEmpty } from 'lodash';

import { IPayloadGetCommentsById } from '~/interfaces/IPost';
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
  const { callbackLoading, commentId } = payload || {};
  try {
    callbackLoading?.(true);
    const response = yield call(
      postDataHelper.getCommentDetail,
      fetchable(commentId),
      fetchable(payload.params as any),
    );
    const { actor, list } = response?.data || {};
    if (!!actor && list?.length > 0) {
      const comment = list[0];
      const payload = {
        id: comment?.postId,
        commentId: comment?.id,
        comments: [comment],
        isMerge: false,
        isReplace: true,
      };

      yield put(postActions.updateAllCommentsByParentIdsWithComments(payload));
      const post = yield select((state) => get(
        state, `post.allPosts.${comment?.postId}`, {},
      ));
      if (isEmpty(post) && comment?.postId) {
        post.id = comment.postId;
        post.actor = actor;
        yield put(postActions.addToAllPosts({ data: post }));
      }
    }
    callbackLoading?.(false);
  } catch (e: any) {
    console.error(
      '\x1b[31m🐣️ saga getCommentDetail error: ', e, '\x1b[0m',
    );
    if (
      e?.code === API_ERROR_CODE.POST.postPrivacy
      || e?.code === API_ERROR_CODE.POST.copiedCommentIsDeleted
      || e?.code === API_ERROR_CODE.POST.postDeleted
    ) {
      yield put(postActions.setCommentErrorCode(e.code));
    } else {
      yield showError(e);
    }
    callbackLoading?.(false);
  }
}

export default getCommentDetail;
