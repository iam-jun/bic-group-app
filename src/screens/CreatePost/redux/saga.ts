import {put, takeLatest} from 'redux-saga/effects';

import postTypes from './constants';
import postActions from './actions';
import IPost from '~/interfaces/IPost';

export default function* saga() {
  yield takeLatest(postTypes.SELECT_POST, selectPost);
}

function* selectPost({payload}: {payload: IPost}) {
  try {
    yield put(postActions.setPosts([payload]));
  } catch (err) {
    console.log('selectPost', err);
  }
}
