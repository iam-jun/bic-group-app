import {put, call, select} from 'redux-saga/effects';

import groupsActions from '../actions';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import showError from '~/store/commonSaga/showError';
import {IParamGetCommunities} from '~/interfaces/IGroup';

export default function* getDiscoverCommunities({
  payload,
}: {
  type: string;
  payload: any;
}): any {
  try {
    yield put(groupsActions.setDiscoverCommunities({loading: true}));
    const params: IParamGetCommunities = {};
    const response = yield call(groupsDataHelper.getCommunities, params);

    //todo handle paging
    const canLoadMore = false;
    const list = response?.data || [];

    yield put(
      groupsActions.setDiscoverCommunities({loading: false, canLoadMore, list}),
    );
  } catch (err) {
    console.log('\x1b[33m', 'editGroupDetail : error', err, '\x1b[0m');
    yield put(groupsActions.setDiscoverCommunities({loading: false}));
    yield showError(err);
  }
}
