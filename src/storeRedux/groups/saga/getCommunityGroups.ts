import { put, call } from 'redux-saga/effects';

import groupsActions from '../actions';
import groupApi from '../../../api/GroupApi';
import showError from '~/storeRedux/commonSaga/showError';
import { IGetCommunityGroup } from '~/interfaces/IGroup';

export default function* getCommunityGroups({
  payload,
}: {
  type: string;
  payload: { id: string; params?: IGetCommunityGroup };
}) {
  try {
    const { id, params } = payload;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const response = yield call(groupApi.getCommunityGroups, id, params);

    const groups = response.data;
    if (groups?.length > 0) {
      yield put(groupsActions.setCommunityGroups(groups));
    } else {
      yield put(groupsActions.setCommunityGroups([]));
    }
  } catch (err) {
    console.error(
      '\x1b[33m', 'editGroupDetail : error', err, '\x1b[0m',
    );
    yield put(groupsActions.setCommunityGroups([]));
    yield showError(err);
  }
}
