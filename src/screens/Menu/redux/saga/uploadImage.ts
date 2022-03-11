import {put, call} from 'redux-saga/effects';

import {IUserImageUpload} from '~/interfaces/IEditUser';
import FileUploader from '~/services/fileUploader';
import {showError} from '.';
import menuActions from '../actions';

export default function* uploadImage({
  payload,
  callback,
}: {
  type: string;
  payload: IUserImageUpload;
  callback?: () => void;
}) {
  try {
    const {file, id, fieldName, uploadType} = payload;
    yield updateLoadingImageState(fieldName, true);
    const data: string = yield FileUploader.getInstance().upload({
      file,
      uploadType,
    });
    console.log('data>>>>>>>>>>>>>>>>>>', data);
    yield put(menuActions.editMyProfile({id, [fieldName]: data}));
    if (callback) return callback();
  } catch (err) {
    console.log('\x1b[33m', 'uploadImage : error', err, '\x1b[0m');
    yield updateLoadingImageState(payload.fieldName, false);
    yield showError(err);
  }
}

function* updateLoadingImageState(
  fieldName: 'avatar' | 'background_img_url',
  value: boolean,
) {
  if (fieldName === 'avatar') {
    yield put(menuActions.setLoadingAvatar(value));
  } else {
    yield put(menuActions.setLoadingCover(value));
  }
}
