import { takeLatest } from 'redux-saga/effects';
import menuTypes from '../types';
import uploadImage from './uploadImage';

export default function* menuSaga() {
  yield takeLatest(
    menuTypes.UPLOAD_IMAGE, uploadImage,
  );
}
