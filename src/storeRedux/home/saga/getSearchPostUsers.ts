import { put, select } from 'redux-saga/effects';
import { IParamsGetUsers } from '~/interfaces/IAppHttpRequest';
import homeActions from '~/storeRedux/home/actions';
import groupApi from '~/api/GroupApi';

export default function* getSearchPostUsers({
  payload,
}: {
  payload: string;
  type: string;
}): any {
  try {
    const state = yield select((state) => state?.home?.newsfeedSearchUsers);
    let data = state?.data || [];
    const { groupId } = yield select((state) => state?.home?.newsfeedSearch);

    // if doesnt have payload a.k.a search key => action load more page
    let params: IParamsGetUsers | undefined;
    if (payload || payload === '') {
      data = [];
      yield put(homeActions.setNewsfeedSearchUsers({
        key: payload,
        loading: true,
        canLoadMore: true,
        offset: 0,
        data,
      }));
      params = { key: payload, offset: 0, limit: state.limit };
    } else if (state && state.canLoadMore && state.data?.length) {
      params = {
        key: state.key,
        offset: state.data.length,
        limit: state.limit,
      };
    }

    if (state && params) {
      const response = yield groupApi.getUsers({ ...params, groupId });
      const newData = data.concat(response?.data || []) || [];
      const newCanLoadMore = newData?.length > state.data?.length;
      yield put(homeActions.setNewsfeedSearchUsers({
        key: params.key,
        limit: params.limit,
        offset: params.offset,
        groupId,
        data: newData,
        loading: false,
        canLoadMore: newCanLoadMore,
      }));
    } else {
      console.warn('\x1b[36m🐣️ saga getSearchPostUsers: cant load more\x1b[0m');
    }
  } catch (e) {
    console.error(
      '\x1b[31m🐣️ saga getSearchPostUsers error: ', e, '\x1b[0m',
    );
  }
}
