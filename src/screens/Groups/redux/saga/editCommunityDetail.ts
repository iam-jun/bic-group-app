import {put, call, select} from 'redux-saga/effects';

import {IToastMessage} from '~/interfaces/common';
import * as modalActions from '~/store/modal/actions';
import {ICommunityDetailEdit} from '~/interfaces/IGroup';
import groupsActions from '../actions';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import showError from '~/store/commonSaga/showError';
import showToastEditSuccess from './showToastEditSuccess';

export default function* editCommunityDetail({
  payload,
}: {
  type: string;
  payload: {
    data: ICommunityDetailEdit;
    editFieldName?: string;
    callback?: () => void;
  };
}) {
  const {data, editFieldName, callback} = payload;
  try {
    // @ts-ignore
    const resp = yield call(
      groupsDataHelper.editCommunityDetail,
      data.id,
      data,
    );

    if (!!resp?.data) {
      const {communityDetail} = yield select(state => state?.groups) || {};
      yield put(
        groupsActions.setCommunityDetail({...communityDetail, ...resp.data}),
      );
    }

    if (!!editFieldName) yield showToastEditSuccess(editFieldName);

    if (callback) callback();
  } catch (err) {
    console.log('\x1b[33m', 'editGroupDetail : error', err, '\x1b[0m');
    yield showError(err);
    // just in case there is some error regarding editing images url
    yield put(groupsActions.setLoadingAvatar(false));
    yield put(groupsActions.setLoadingCover(false));
  }
}
