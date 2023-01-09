import { put, select, takeLatest } from 'redux-saga/effects';
import { get } from 'lodash';

import {
  IPayloadShowModal,
} from '~/interfaces/common';
import modalActions from './actions';
import * as types from './constants';
import modalKeySelector from '~/storeRedux/modal/keySelector';
import { timeOut } from '~/utils/common';
import { BottomListProps } from '~/components/BottomList';

export default function* commonSaga() {
  yield takeLatest(
    types.SHOW_MODAL, showModal,
  );
  yield takeLatest(
    types.SHOW_BOTTOM_LIST,
    showBottomList,
  );
}

function* showModal({
  payload,
}: {
  type: string;
  payload: IPayloadShowModal;
}): any {
  const modal = yield select((state) => get(
    state, modalKeySelector.modal,
  ));
  const { isOpen } = modal || {};
  if (isOpen) {
    const payload = { isOpen: false, ContentComponent: undefined };
    yield put(modalActions.setModal(payload));
    yield timeOut(200);
  }
  yield put(modalActions.setModal(payload));
}

function* showBottomList({
  payload,
}: {
  type: string;
  payload: BottomListProps;
}): any {
  const { isOpen } = payload || {};
  if (isOpen) {
    const _payload = { isOpen: false, data: [] } as BottomListProps;
    yield put(modalActions.setBottomList(_payload));
    yield timeOut(200);
  }
  yield put(modalActions.setBottomList(payload));
}
