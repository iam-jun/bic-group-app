import { call } from 'redux-saga/effects';
import streamApi from '~/api/StreamApi';
import showError from '~/storeRedux/commonSaga/showError';
import { IPayloadAddToAllPost, IPayloadPutMarkAsRead } from '~/interfaces/IPost';
import usePostsStore from '~/store/entities/posts';

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
    const response = yield call(
      streamApi.putMarkAsRead, postId,
    );
    const isSuccess = !!response?.data;
    callback?.(isSuccess);
    if (isSuccess) {
      const post = usePostsStore.getState()?.posts?.[postId] || {};
      usePostsStore.getState().actions.addToPosts({
        data: {
          ...post,
          markedReadPost: true,
          markedReadSuccess: true,
        },
      } as IPayloadAddToAllPost);
    }
  } catch (e) {
    callback?.(false);
    showError(e);
  }
}
export default putMarkAsRead;
