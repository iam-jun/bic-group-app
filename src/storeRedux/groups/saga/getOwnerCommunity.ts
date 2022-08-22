import { call, put } from 'redux-saga/effects';
import groupApi from '~/api/GroupApi';
import { SetManagedPayload } from '~/interfaces/IGroup';
import showError from '~/storeRedux/commonSaga/showError';
import groupsActions from '../actions';

export default function* getOwnerCommunity() {
  try {
    const response = yield call(groupApi.getOwnerCommunity);

    const { data } = response;
    const newIds = data.map((item) => item.id);
    const newItems = data.reduce(
      (accumulator, currentItem) => ({
        ...accumulator,
        [currentItem.id]: currentItem,
      }),
      {},
    );

    const updateObj: SetManagedPayload = {
      owner: {
        canLoadMore: false,
        ids: newIds,
        items: newItems,
      },
    };
    yield put(groupsActions.setManaged(updateObj));
  } catch (err) {
    console.error('\x1b[33m', 'getManaged : error', err, '\x1b[0m');
    yield showError(err);
  }
}
