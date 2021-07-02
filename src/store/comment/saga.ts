import {all, put, call, takeLatest, select} from 'redux-saga/effects';

import * as types from './constants';
import * as actions from './actions';
import IComment from '~/interfaces/IComment';
import {timeOut} from '~/utils/common';

export default function* saga() {
  yield takeLatest(types.GET_COMMENTS, getComments);
  yield takeLatest(types.SELECT_COMMENT, selectComment);
}

function* getComments() {
  try {
    //[FIXME] Should be removed when API ready for use
    yield timeOut(1000);
    // yield put(actions.setComments(commentData));
  } catch (err) {
    console.log('getComments', {err});
  } finally {
  }
}

function* selectComment({payload}: {payload: IComment}) {
  try {
    yield put(actions.setComments([payload]));
  } catch (err) {
    console.log('selectComment', err);
  }
}
