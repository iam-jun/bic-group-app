import { call } from 'redux-saga/effects';
import postDataHelper from '~/api/PostDataHelper';
import { IPayloadPutMarkSeenPost } from '~/interfaces/IPost';

function* putMarkSeenPost({
  payload,
}: {
  type: string;
  payload: IPayloadPutMarkSeenPost;
}): any {
  if (!payload) {
    return;
  }
  const { postId, callback } = payload;
  if (!postId) {
    console.error('\x1b[36m🐣️ postMarkAsRead postId not found\x1b[0m');
    return;
  }
  try {
    const response = yield call(
      postDataHelper.putMarkSeenPost, postId,
    );
    callback?.(!!response?.data);
  } catch (e) {
    callback?.(false);
  }
}
export default putMarkSeenPost;
