import { call, put, select } from 'redux-saga/effects';
import { IGetSeenPostListSheet } from '~/interfaces/IPost';
import postDataHelper from '~/screens/Post/helper/PostDataHelper';
import postActions from '~/screens/Post/redux/actions';
import showError from '~/store/commonSaga/showError';

function* getSeenPost({
  payload,
}: {
  type: string;
  payload: IGetSeenPostListSheet;
}): any {
  try {
    const { data, canLoadMore } = yield select((state) => state?.post?.seenPostList) || {};
    const params = {
      postId: payload.postId,
      offset: data.length,
    };

    if (!canLoadMore) {
      return;
    }
    const response = yield call(
      postDataHelper.getSeenList, params,
    );

    if (response && response?.data?.list) {
      const newData = response ? response.data : undefined;
      const { list, meta } = newData;
      const dataList = data.concat(list);
      const payloadSet = {
        data: dataList,
        total: meta.total,
        canLoadMore: meta.hasNextPage,
      };
      yield put(postActions.setSeenPost(payloadSet));
    } else {
      return Promise.reject(response);
    }
  } catch (e) {
    console.error(
      '\x1b[31m🐣️ saga getCommentsByPostId error: ', e, '\x1b[0m',
    );
    yield showError(e);
  }
}

export default getSeenPost;
