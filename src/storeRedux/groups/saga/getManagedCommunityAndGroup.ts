import { call, put, select } from 'redux-saga/effects';
import groupApi from '~/api/GroupApi';
import appConfig from '~/configs/appConfig';
import { SetManagedPayload } from '~/interfaces/IGroup';
import showError from '~/storeRedux/commonSaga/showError';
import groupsActions from '~/storeRedux/groups/actions';

export default function* getManagedCommunityAndGroup({
  payload,
}: ReturnType<typeof groupsActions.getManagedCommunityAndGroup>) {
  const { groups } = yield select();
  const { managed } = groups;
  const { manage } = managed;

  try {
    const { isRefresh } = payload;
    const { ids, items } = manage;

    yield put(
      groupsActions.setManaged({
        manage: {
          ...manage,
          isLoading: !isRefresh,
        },
      }),
    );

    const response = yield call(groupApi.getManagedCommunityAndGroup, {
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

    const updateObj: SetManagedPayload = {
      manage: {
        ...manage,
        isLoading: false,
        canLoadMore: meta.hasNextPage,
        ids: isRefresh ? newIds : [...ids, ...newIds],
        items: isRefresh ? newItems : { ...items, ...newItems },
      },
    };
    yield put(groupsActions.setManaged(updateObj));
  } catch (err) {
    console.error('\x1b[33m', 'getJoinedAllGroups : error', err, '\x1b[0m');
    yield put(groupsActions.setManaged({
      manage: {
        ...manage,
        isLoading: false,
      },
    }));
    yield showError(err);
  }
}
