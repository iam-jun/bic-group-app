import { call, put, select } from 'redux-saga/effects';
import groupApi from '~/api/GroupApi';
import appConfig from '~/configs/appConfig';
import { SetJoinedAllGroupsPayload } from '~/interfaces/IGroup';
import showError from '~/storeRedux/commonSaga/showError';
import groupsActions from '~/storeRedux/groups/actions';

export default function* getJoinedAllGroups({
  payload,
}: ReturnType<typeof groupsActions.getJoinedAllGroups>) {
  try {
    const { isRefresh } = payload;
    const { groups } = yield select();
    const { joinedAllGroups } = groups;
    const { ids, items } = joinedAllGroups;

    yield put(
      groupsActions.setJoinedAllGroups({ isLoading: !isRefresh, isRefresh }),
    );

    const response = yield call(groupApi.getJoinedAllGroups, {
      offset: isRefresh ? 0 : ids.length,
      limit: appConfig.recordsPerPage,
    });

    const { data, meta } = response;
    const newIds = data.map((item) => item.id);
    const newItems = data.reduce(
      (accumulator, currentItem) => ({
        ...accumulator,
        [currentItem.id]: currentItem,
      }),
      {},
    );

    const updateObj: SetJoinedAllGroupsPayload = {
      isRefresh: false,
      isLoading: false,
      canLoadMore: meta.hasNextPage,
      ids: isRefresh ? newIds : [...ids, ...newIds],
      items: isRefresh ? newItems : { ...items, ...newItems },
    };
    yield put(groupsActions.setJoinedAllGroups(updateObj));
  } catch (err) {
    console.error('\x1b[33m', 'getJoinedAllGroups : error', err, '\x1b[0m');
    yield put(groupsActions.setJoinedAllGroups({ isLoading: false, isRefresh: false }));
    yield showError(err);
  }
}
