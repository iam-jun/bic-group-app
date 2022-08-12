import { call, put } from 'redux-saga/effects';

import { IPayloadRemoveAudiencesOfPost } from '~/interfaces/IPost';
import modalActions from '~/store/modal/actions';
import postDataHelper from '../../helper/PostDataHelper';
import postActions from '../actions';
import showError from '~/store/commonSaga/showError';

export default function* removeAudiencesFromPost({
  payload,
}: {
  type: string;
  payload: IPayloadRemoveAudiencesOfPost;
}): any {
  const { id, listAudiences } = payload;
  if (!id || !listAudiences?.length) {
    console.warn('\x1b[31m🐣️ saga removeAudiencesFromPost: id not found or listAudiences is not an array\x1b[0m');
    return;
  }
  try {
    const data = {
      audience: {
        userIds: [],
        groupIds: listAudiences,
      },
    };
    const response = yield call(postDataHelper.putEditPost, {
      postId: id,
      data,
    });
    if (response?.data) {
      const post = response?.data;
      yield put(postActions.addToAllPosts({ data: post }));
      yield put(
        modalActions.showHideToastMessage({
          content: 'post:text_deleted_audiences',
          props: {
            textProps: { variant: 'h6', useI18n: true },
          },
        }),
      );
    }
  } catch (e: any) {
    console.error('\x1b[31m🐣️ saga removeAudiencesFromPost error: ', e, '\x1b[0m');
    yield call(showError, e);
  }
}
