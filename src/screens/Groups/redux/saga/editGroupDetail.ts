import i18next from 'i18next';
import {put, call} from 'redux-saga/effects';

import {IToastMessage} from '~/interfaces/common';
import * as modalActions from '~/store/modal/actions';
import {IGroupDetailEdit} from '~/interfaces/IGroup';
import groupsActions from '../actions';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import showError from '~/store/commonSaga/showError';

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
  const {data, editFieldName, callback} = payload;
  try {
    const groupId = data.id;
    delete data.id; // edit data should not contain group's id

    // @ts-ignore
    const resp = yield call(groupsDataHelper.editGroupDetail, groupId, data);

    // this field is used to indicate which parts of
    // the profile have been updated
    let toastContent: string;
    if (editFieldName) {
      toastContent = `${editFieldName} ${i18next.t(
        'common:text_updated_successfully',
      )}`;
    } else {
      toastContent = 'common:text_edit_success';
    }

    const toastMessage: IToastMessage = {
      content: toastContent,
      props: {
        textProps: {useI18n: true},
        type: 'success',
      },
    };
    yield put(modalActions.showHideToastMessage(toastMessage));

    yield put(groupsActions.setGroupDetail(resp?.data));
    if (callback) callback();
  } catch (err) {
    console.log('\x1b[33m', 'editGroupDetail : error', err, '\x1b[0m');
    yield showError(err);
    // just in case there is some error regarding editing images url
    yield put(groupsActions.setLoadingAvatar(false));
    yield put(groupsActions.setLoadingCover(false));
  }
}
