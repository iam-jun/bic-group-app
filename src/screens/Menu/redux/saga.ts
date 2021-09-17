import {select, put, takeLatest} from 'redux-saga/effects';
import {Platform} from 'react-native';

import menuActions from './actions';
import menuTypes from './types';
import menuDataHelper from '~/screens/Menu/helper/MenuDataHelper';
import {IUserEdit, IGetUserProfile} from '~/interfaces/IAuth';
import * as modalActions from '~/store/modal/actions';
import {mapProfile} from './helper';
import {IUserImageUpload} from '~/interfaces/IEditUser';
import {IResponseData, IToastMessage} from '~/interfaces/common';

export default function* menuSaga() {
  yield takeLatest(menuTypes.GET_USER_PROFILE, getUserProfile);
  yield takeLatest(menuTypes.GET_MY_PROFILE, getMyProfile);
  yield takeLatest(menuTypes.EDIT_MY_PROFILE, editMyProfile);
  yield takeLatest(menuTypes.UPLOAD_IMAGE, uploadImage);
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

function* editMyProfile({payload}: {type: string; payload: IUserEdit}) {
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
      toastContent = 'common:text_edit_success';
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
  } catch (err) {
    console.log('\x1b[33m', 'editMyProfile : error', err, '\x1b[0m');
    const toastMessage: IToastMessage = {
      content: 'common:text_edit_fail',
      props: {
        textProps: {useI18n: true},
        type: 'error',
      },
    };
    yield put(modalActions.showHideToastMessage(toastMessage));
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
    const {image, id, fieldName} = payload;
    yield updateLoadingImageState(fieldName, true);

    const formData = new FormData();
    if (Platform.OS === 'web') {
      formData.append(
        'file',
        // @ts-ignore
        image,
        image.name || 'imageName',
      );
    } else {
      formData.append('file', {
        type: image.type,
        // @ts-ignore
        name: image.name || 'imageName',
        uri: image.uri,
      });
    }
    const response: IResponseData = yield menuDataHelper.uploadImage(formData);
    yield put(
      menuActions.editMyProfile({id, [fieldName]: response?.data?.src}),
    );
  } catch (err) {
    console.log('\x1b[33m', 'uploadImage : error', err, '\x1b[0m');
    yield updateLoadingImageState(payload.fieldName, false);
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
