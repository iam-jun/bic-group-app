import {select, put, takeLatest} from 'redux-saga/effects';

import menuActions from '../actions';
import menuTypes from '../types';
import menuDataHelper from '~/screens/Menu/helper/MenuDataHelper';
import {IGetUserProfile, IUserAddWorkExperience} from '~/interfaces/IAuth';
import * as modalActions from '~/store/modal/actions';
import {mapProfile, mapWorkExperience} from '../helper';
import {IUserImageUpload} from '~/interfaces/IEditUser';
import {IResponseData, IToastMessage} from '~/interfaces/common';
import FileUploader from '~/services/fileUploader';
import errorCode from '~/constants/errorCode';
import {updateUserFromSharedPreferences} from '~/services/sharePreferences';
import editMyProfile from './editMyProfile';

export default function* menuSaga() {
  yield takeLatest(menuTypes.GET_USER_PROFILE, getUserProfile);
  yield takeLatest(menuTypes.GET_MY_PROFILE, getMyProfile);
  yield takeLatest(menuTypes.EDIT_MY_PROFILE, editMyProfile);
  yield takeLatest(menuTypes.UPLOAD_IMAGE, uploadImage);
  yield takeLatest(menuTypes.GET_MY_WORK_EXPERIENCE, getMyWorkExperience);
  yield takeLatest(menuTypes.ADD_WORK_EXPERIENCE, addWorkExperience);
  yield takeLatest(menuTypes.EDIT_WORK_EXPERIENCE, editWorkExperience);
  yield takeLatest(menuTypes.DELETE_WORK_EXPERIENCE, deleteWorkExperience);
  yield takeLatest(menuTypes.GET_USER_WORK_EXPERIENCE, getWorkExperience);
}

function* getUserProfile({payload}: {type: string; payload: IGetUserProfile}) {
  const {userId, params} = payload;
  try {
    const response: IResponseData = yield menuDataHelper.getUserProfile(
      userId,
      params,
    );

    yield put(menuActions.setUserProfile(mapProfile(response.data)));
  } catch (err) {
    yield put(menuActions.setUserProfile(null));
    yield put(menuActions.setShowUserNotFound());
    console.log('getUserProfile error:', err);
  }
}

function* getMyProfile({payload}: {type: string; payload: IGetUserProfile}) {
  const {menu} = yield select();
  const {myProfile} = menu;
  const {userId, params} = payload;
  try {
    const response: IResponseData = yield menuDataHelper.getUserProfile(
      userId,
      params,
    );
    yield updateUserFromSharedPreferences({
      name: response?.data?.fullname,
      avatar: response?.data?.avatar,
    });
    yield put(menuActions.setMyProfile(mapProfile(response.data)));
  } catch (err) {
    yield put(menuActions.setMyProfile(myProfile));
    console.log('getMyProfile error:', err);
  }
}

function* uploadImage({
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

function* getMyWorkExperience() {
  try {
    const response: IResponseData = yield menuDataHelper.getMyWorkExperience();

    yield put(
      menuActions.setMyWorkExperience(mapWorkExperience(response?.data)),
    );
  } catch (err) {
    console.log('getMyWorkExperience error:', err);
  }
}

function* addWorkExperience({
  payload,
  callback,
}: {
  type: string;
  payload: IUserAddWorkExperience;
  callback?: () => void;
}) {
  try {
    const {
      company,
      titlePosition,
      location,
      description,
      currentlyWorkHere,
      startDate,
      endDate,
    } = payload;

    yield menuDataHelper.addWorkExperience({
      company,
      title_position: titlePosition,
      location,
      description,
      currently_work_here: currentlyWorkHere,
      start_date: startDate,
      end_date: endDate,
    });

    yield put(menuActions.getMyWorkExperience());

    if (callback) return callback();
  } catch (err) {
    console.log('addWorkExperience:', err);
    yield showError(err);
  }
}

function* editWorkExperience({
  payload,
  callback,
  id,
}: {
  type: string;
  id: number;
  payload: IUserAddWorkExperience;
  callback?: () => void;
}) {
  try {
    const {
      company,
      titlePosition,
      location,
      description,
      currentlyWorkHere,
      startDate,
      endDate,
    } = payload;

    yield menuDataHelper.editWorkExperience(id, {
      company,
      title_position: titlePosition,
      location,
      description,
      currently_work_here: currentlyWorkHere,
      start_date: startDate,
      end_date: endDate,
    });

    yield put(menuActions.getMyWorkExperience());

    if (callback) return callback();
  } catch (err) {
    console.log('editWorkExperience:', err);
    yield showError(err);
  }
}

function* deleteWorkExperience({
  id,
  callback,
}: {
  type: string;
  id: number;
  callback?: () => void;
}) {
  try {
    const response: IResponseData = yield menuDataHelper.deleteWorkExperience(
      id,
    );
    if (!!response?.data) {
      yield put(
        menuActions.setMyWorkExperience(mapWorkExperience(response.data)),
      );
    }

    if (callback) return callback();
  } catch (err) {
    console.log('deleteWorkExperience:', err);
    yield showError(err);
  }
}

export function* showError(err: any) {
  if (err.code === errorCode.systemIssue) return;

  const toastMessage: IToastMessage = {
    content:
      err?.meta?.message ||
      err?.meta?.errors?.[0]?.message ||
      'common:text_error_message',
    props: {
      textProps: {useI18n: true},
      type: 'error',
    },
  };
  yield put(modalActions.showHideToastMessage(toastMessage));
}

function* getWorkExperience({id}: {id: number}) {
  try {
    const response: IResponseData = yield menuDataHelper.getWorkExperience(id);
    if (response?.data) {
      yield put(
        menuActions.setUserWorkExperience(mapWorkExperience(response.data)),
      );
    }
  } catch (err) {
    console.log('getWorkExperience error:', err);
  }
}
