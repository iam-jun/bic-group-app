import {select, put, takeLatest} from 'redux-saga/effects';
import i18next from 'i18next';

import menuActions from './actions';
import menuTypes from './types';
import menuDataHelper from '~/screens/Menu/helper/MenuDataHelper';
import {
  IUserEdit,
  IGetUserProfile,
  IUserAddWorkExperience,
} from '~/interfaces/IAuth';
import * as modalActions from '~/store/modal/actions';
import {mapProfile, mapWorkExperience} from './helper';
import {IUserImageUpload} from '~/interfaces/IEditUser';
import {IResponseData, IToastMessage} from '~/interfaces/common';
import FileUploader from '~/services/fileUploader';

export default function* menuSaga() {
  yield takeLatest(menuTypes.GET_USER_PROFILE, getUserProfile);
  yield takeLatest(menuTypes.GET_MY_PROFILE, getMyProfile);
  yield takeLatest(menuTypes.EDIT_MY_PROFILE, editMyProfile);
  yield takeLatest(menuTypes.UPLOAD_IMAGE, uploadImage);
  yield takeLatest(menuTypes.GET_MY_WORK_EXPERIENCE, getMyWorkExperience);
  yield takeLatest(menuTypes.ADD_WORK_EXPERIENCE, addWorkExperience);
  yield takeLatest(menuTypes.EDIT_WORK_EXPERIENCE, editWorkExperience);
  yield takeLatest(menuTypes.DELETE_WORK_EXPERIENCE, deleteWorkExperience);
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
    yield put(menuActions.setMyProfile(mapProfile(response.data)));
  } catch (err) {
    yield put(menuActions.setMyProfile(myProfile));
    console.log('getMyProfile error:', err);
  }
}

function* editMyProfile({
  payload,
  editFieldName,
  callback,
}: {
  type: string;
  payload: IUserEdit;
  editFieldName?: string;
  callback?: () => void;
}) {
  try {
    const result: unknown = yield requestEditMyProfile(payload);

    // checking if uploading avatar/cover image
    // to use different toast message content
    const {avatar, background_img_url} = payload;
    let toastContent: string;

    if (!!avatar) {
      toastContent = 'common:avatar_changed';
    } else if (!!background_img_url) {
      toastContent = 'common:cover_changed';
    } else {
      // this field is used to indicate which parts of
      // user profile have been updated
      if (editFieldName) {
        toastContent = `${editFieldName} ${i18next.t(
          'settings:text_updated_successfully',
        )}`;
      } else {
        toastContent = 'common:text_edit_success';
      }
    }

    const toastMessage: IToastMessage = {
      content: toastContent,
      props: {
        textProps: {useI18n: true},
        type: 'success',
      },
    };
    yield put(modalActions.showHideToastMessage(toastMessage));

    yield put(menuActions.setMyProfile(mapProfile(result)));

    if (callback) return callback();
  } catch (err) {
    console.log('\x1b[33m', 'editMyProfile : error', err, '\x1b[0m');

    // @ts-ignore
    const errorMessage: string = err?.meta?.message;

    switch (errorMessage) {
      case 'This Email is used':
        yield put(
          menuActions.setEmailEditError(
            i18next.t('settings:text_email_is_used'),
          ),
        );
        break;

      case 'This phone number is used':
        yield put(
          menuActions.setPhoneNumberEditError(
            i18next.t('settings:text_phone_number_is_used'),
          ),
        );
        break;

      default:
        yield showError(err);
    }

    // just in case there is some error regarding editing images url
    yield put(menuActions.setLoadingAvatar(false));
    yield put(menuActions.setLoadingCover(false));
  }
}

const requestEditMyProfile = async (data: IUserEdit) => {
  const userId = data.id;
  delete data.id; // edit data should not contain user's id

  // @ts-ignore
  const response = await menuDataHelper.editMyProfile(userId, data);

  return response.data;
};

function* uploadImage({payload}: {type: string; payload: IUserImageUpload}) {
  try {
    const {file, id, fieldName, uploadType} = payload;
    yield updateLoadingImageState(fieldName, true);

    const data: string = yield FileUploader.getInstance().upload({
      file,
      uploadType,
    });

    yield put(menuActions.editMyProfile({id, [fieldName]: data}));
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
    const response: IResponseData = yield menuDataHelper.getWorkExperience();

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
    yield menuDataHelper.deleteWorkExperience(id);

    yield put(menuActions.getMyWorkExperience());

    if (callback) return callback();
  } catch (err) {
    console.log('deleteWorkExperience:', err);
    yield showError(err);
  }
}

function* showError(err: any) {
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
