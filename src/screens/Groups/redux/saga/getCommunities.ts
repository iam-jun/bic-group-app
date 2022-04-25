import i18next from 'i18next';
import {put, call} from 'redux-saga/effects';

import {IToastMessage} from '~/interfaces/common';
import * as modalActions from '~/store/modal/actions';
import {IGroupDetailEdit} from '~/interfaces/IGroup';
import groupsActions from '../actions';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import showError from '~/store/commonSaga/showError';

export default function* getCommunities({}: //   payload,
{
  type: string;
  //   payload: {};
}) {
  try {
    // @ts-ignore
    const resp = yield call(groupsDataHelper.getCommunities, true);
    console.log('>>>>>>>RESP', resp);
  } catch (err) {
    console.log('\x1b[33m', 'editGroupDetail : error', err, '\x1b[0m');
    yield showError(err);
  }
}
