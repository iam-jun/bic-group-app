import i18next from 'i18next';
import {put} from 'redux-saga/effects';

import {IToastMessage} from '~/interfaces/common';
import {IUserEdit} from '~/interfaces/IAuth';
import modalActions from '~/store/modal/actions';
import menuActions from '../actions';
import {mapProfile} from '../helper';
import {showError} from '.';
import menuDataHelper from '~/screens/Menu/helper/MenuDataHelper';

export default function* editMyProfile({
  payload,
  editFieldToastMessage,
  callback,
}: {
  type: string;
  payload: IUserEdit;
  editFieldToastMessage?: string;
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
      if (editFieldToastMessage) {
        toastContent = editFieldToastMessage;
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
