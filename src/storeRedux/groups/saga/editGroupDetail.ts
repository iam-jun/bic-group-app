import { put, call } from 'redux-saga/effects';

import { IGroupDetailEdit } from '~/interfaces/IGroup';
import groupsActions from '../actions';
import groupsDataHelper from '../../../screens/Groups/helper/GroupsDataHelper';
import showError from '~/storeRedux/commonSaga/showError';
import showToastEditSuccess from './showToastEditSuccess';

export default function* editGroupDetail({
  payload,
}: {
  type: string;
  payload: {
    data: IGroupDetailEdit;
    editFieldName?: string;
    callback?: () => void;
  };
}) {
  const { data, editFieldName, callback } = payload;
  try {
    const groupId = data.id;
    delete data.id; // edit data should not contain group's id

    const resp = yield call(groupsDataHelper.editGroupDetail, groupId, data);

    if (editFieldName) yield showToastEditSuccess(editFieldName);

    yield put(groupsActions.setGroupDetail(resp?.data));
    if (callback) callback();
  } catch (err) {
    console.error(
      '\x1b[33m', 'editGroupDetail : error', err, '\x1b[0m',
    );
    yield showError(err);
    // just in case there is some error regarding editing images url
    yield put(groupsActions.setLoadingAvatar(false));
    yield put(groupsActions.setLoadingCover(false));
  }
}
