import {put, takeLatest} from 'redux-saga/effects';

import menuTypes from '../types';
import * as modalActions from '~/store/modal/actions';
import {IResponseData, IToastMessage} from '~/interfaces/common';
import errorCode from '~/constants/errorCode';
import editMyProfile from './editMyProfile';
import uploadImage from './uploadImage';
import getMyProfile from './getMyProfile';
import getUserProfile from './getUserProfile';
import menuDataHelper from '../../helper/MenuDataHelper';
import menuActions from '../actions';
import {mapWorkExperience} from '../helper';
import {IUserAddWorkExperience} from '~/interfaces/IAuth';

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
  if (err?.code === errorCode.systemIssue) return;

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
