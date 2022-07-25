import { call, put, select } from 'redux-saga/effects';
import { get } from 'lodash';
import postDataHelper from '~/screens/Post/helper/PostDataHelper';
import showError from '~/store/commonSaga/showError';
import { IPayloadPutMarkAsRead } from '~/interfaces/IPost';
import postKeySelector from '~/screens/Post/redux/keySelector';
import postActions from '~/screens/Post/redux/actions';

function* putMarkAsRead({
  payload,
}: {
  type: string;
  payload: IPayloadPutMarkAsRead;
}): any {
  const { postId, callback } = payload;
  if (!postId) {
    console.error('\x1b[36m🐣️ postMarkAsRead postId not found\x1b[0m');
    return;
  }
  try {
    const response = yield call(postDataHelper.putMarkAsRead, postId);
    const isSuccess = !!response?.data;
    callback?.(isSuccess);
    if (isSuccess) {
      const post = yield select((state) => get(state, postKeySelector.postById(postId)));
      post.markedReadPost = true;
      post.markedReadSuccess = true;
      yield put(postActions.addToAllPosts({ ...post }));
    }
  } catch (e) {
    callback?.(false);
    showError(e);
  }
}
export default putMarkAsRead;
