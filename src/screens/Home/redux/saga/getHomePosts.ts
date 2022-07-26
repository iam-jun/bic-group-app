import { put, select } from 'redux-saga/effects';
import { get } from 'lodash';
import { IPayloadGetHomePost } from '~/interfaces/IHome';
import homeActions from '~/screens/Home/redux/actions';
import homeKeySelector from '~/screens/Home/redux/keySelector';
import homeDataHelper from '~/screens/Home/helper/HomeDataHelper';
import postActions from '~/screens/Post/redux/actions';

export default function* getHomePosts({
  payload,
}: {
  payload: IPayloadGetHomePost;
  type: string;
}): any {
  try {
    const { isRefresh } = payload;
    let homePosts; let
      offset;
    const { noMoreHomePosts, loadingHomePosts } = yield select((state) => get(state, 'home'));

    if ((noMoreHomePosts || loadingHomePosts) && !isRefresh) {
      return;
    }

    if (isRefresh) {
      yield put(homeActions.setRefreshingHomePosts(true));
      homePosts = [];
      offset = 0;
    } else {
      yield put(homeActions.setLoadingHomePosts(true));
      homePosts = yield select((state) => get(state, homeKeySelector.homePosts)) || [];
      offset = homePosts?.length || 0;
    }

    const response = yield homeDataHelper.getNewsfeed({ offset });
    const result = response?.list || [];
    const hasNextPage = response?.meta?.hasNextPage;

    yield put(postActions.addToAllPosts({ data: result }));

    const newHomePosts = homePosts.concat?.(result) || result;
    yield put(homeActions.setHomePosts(newHomePosts));

    yield put(homeActions.setNoMoreHomePosts(!hasNextPage));

    if (isRefresh) {
      yield put(homeActions.setRefreshingHomePosts(false));
    } else {
      yield put(homeActions.setLoadingHomePosts(false));
    }
  } catch (error) {
    yield put(homeActions.setRefreshingHomePosts(false));
    yield put(homeActions.setLoadingHomePosts(false));
  }
}
