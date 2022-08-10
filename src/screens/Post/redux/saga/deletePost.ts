import { get } from 'lodash';
import { call, put, select } from 'redux-saga/effects';

import { IPayloadDeletePost } from '~/interfaces/IPost';
import modalActions from '~/store/modal/actions';
import postDataHelper from '../../helper/PostDataHelper';
import postActions from '../actions';
import postKeySelector from '../keySelector';
import { timeOut } from '~/utils/common';
import showError from '~/store/commonSaga/showError';

export default function* deletePost({
  payload,
}: {
  type: string;
  payload: IPayloadDeletePost;
}): any {
  const { id, isDraftPost, callbackError } = payload || {};
  if (!id) {
    console.warn('\x1b[31m🐣️ saga deletePost: id not found\x1b[0m');
    return;
  }
  try {
    const response = yield postDataHelper.deletePost(id, isDraftPost);
    if (response?.data) {
      const post = yield select((state) => get(state, postKeySelector.postById(id)));
      post.deleted = true;
      yield put(postActions.addToAllPosts({ data: post }));
      yield timeOut(500);

      yield put(
        modalActions.showHideToastMessage({
          content: 'post:delete_post_complete',
          props: {
            textProps: { variant: 'h6', useI18n: true },
            type: 'success',
          },
        }),
      );
    }
  } catch (e: any) {
    if (e?.meta?.errors?.groups_denied) {
      callbackError?.(e.meta.errors.groups_denied)
    } else yield call(showError, e);
  }
}
