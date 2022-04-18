import {put, call} from 'redux-saga/effects';
import {IUploadType} from '~/configs/resourceConfig';
import {IFilePicked} from '~/interfaces/common';

import {IUserImageUpload} from '~/interfaces/IEditUser';
import FileUploader, {IGetFile} from '~/services/fileUploader';
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
    const data: IGetFile = yield call(upload, file, uploadType);

    yield put(menuActions.editMyProfile({id, [fieldName]: data?.url}));
    if (callback) return callback();
  } catch (err) {
    console.log('\x1b[33m', 'uploadImage : error', err, '\x1b[0m');
    yield updateLoadingImageState(payload.fieldName, false);
    yield showError(err);
  }
}

function* upload(file: IFilePicked, uploadType: IUploadType) {
  const data: IGetFile = yield FileUploader.getInstance().upload({
    file,
    uploadType,
  });
  return data;
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
