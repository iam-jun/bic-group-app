import {all, put, call, takeLatest, select} from 'redux-saga/effects';

import * as types from './constants';
import * as actions from './actions';
import {timeOut} from '~/utils/common';

import {commentData} from '~/screens/Home/PostDetail/dummy-comment-data';

export default function* saga() {
  yield takeLatest(types.GET_COMMENTS, getComments);
}

function* getComments() {
  try {
    //[FIXME] Should be removed when API ready for use
    yield timeOut(1000);
    yield put(actions.setComments(commentData));
  } catch (err) {
    console.log('getComments', {err});
  } finally {
  }
}
