import { call, put } from 'redux-saga/effects';
import { isEmpty } from 'lodash';

import { IPayloadAddToAllPost, IPayloadGetCommentsById } from '~/interfaces/IPost';
import streamApi from '~/api/StreamApi';
import useCommentsStore from '~/store/entities/comments';
import usePostsStore from '~/store/entities/posts';
import postActions from '~/storeRedux/post/actions';
import showError from '~/storeRedux/commonSaga/showError';
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
      streamApi.getCommentDetail,
      commentId,
      payload.params as any,
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

      useCommentsStore.getState().actions.addToCommentsByParentIdWithComments(payload);
      const post = usePostsStore.getState().posts?.[comment?.postId] || {};
      if (isEmpty(post) && comment?.postId) {
        post.id = comment.postId;
        post.actor = actor;
        usePostsStore.getState().actions.addToPosts({ data: post } as IPayloadAddToAllPost);
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
