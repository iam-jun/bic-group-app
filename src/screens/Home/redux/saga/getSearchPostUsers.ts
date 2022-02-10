import {put, select} from 'redux-saga/effects';
import {IParamsGetUsers} from '~/interfaces/IAppHttpRequest';
import homeActions from '~/screens/Home/redux/actions';
import homeDataHelper from '~/screens/Home/helper/HomeDataHelper';

export default function* getSearchPostUsers({
  payload,
}: {
  payload: string;
  type: string;
}): any {
  try {
    const state = yield select(state => state?.home?.newsfeedSearchUsers);
    let data = state?.data || [];

    //if doesnt have payload a.k.a search key => action load more page
    let params: IParamsGetUsers | undefined = undefined;
    if (payload || payload === '') {
      data = [];
      yield put(
        homeActions.setNewsfeedSearchUsers({
          key: payload,
          loading: true,
          canLoadMore: true,
          offset: 0,
          data: data,
        }),
      );
      params = {key: payload, offset: 0, limit: state.limit};
    } else {
      if (state && state.canLoadMore && state.data?.length) {
        params = {
          key: state.key,
          offset: state.data.length,
          limit: state.limit,
        };
      }
    }

    if (state && params) {
      const response = yield homeDataHelper.getUsers(params);
      const newData = data.concat(response || []) || [];
      const newCanLoadMore = newData?.length > state.data?.length;
      yield put(
        homeActions.setNewsfeedSearchUsers({
          key: params.key,
          limit: params.limit,
          offset: params.offset,
          data: newData,
          loading: false,
          canLoadMore: newCanLoadMore,
        }),
      );
    } else {
      console.log(`\x1b[36m🐣️ saga getSearchPostUsers: cant load more\x1b[0m`);
    }
  } catch (e) {
    console.log(`\x1b[31m🐣️ saga getSearchPostUsers error: `, e, `\x1b[0m`);
  }
}
