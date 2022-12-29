import i18next from 'i18next';
import { IUserEdit } from '~/interfaces/IAuth';
import groupApi from '~/api/GroupApi';
import showToastError from '~/store/helper/showToastError';
import Store from '~/storeRedux';
import menuActions from '~/storeRedux/menu/actions';
import { IToastMessage } from '~/interfaces/common';
import useCommonController from '~/screens/store';
import { mapProfile } from '~/storeRedux/menu/helper';
import useModalStore from '~/store/modal';
import { ToastType } from '~/baseComponents/Toast/BaseToast';

const editMyProfile = (_set) => async ({
  data,
  editFieldToastMessage,
  callback,
}: {
  data: IUserEdit;
  editFieldToastMessage?: string;
  callback?: () => void;
}) => {
  try {
    const response = await groupApi.editMyProfile(data);

    useCommonController.getState().actions.setMyProfile(mapProfile(response.data));

    // checking if uploading avatar/cover image
    // to use different toast message content
    const { avatar, backgroundImgUrl } = data;
    let toastContent: string;

    if (avatar) {
      toastContent = 'common:avatar_changed';
    } else if (backgroundImgUrl) {
      toastContent = 'common:cover_changed';
    } else {
      // this field is used to indicate which parts of
      // user profile have been updated
      toastContent = editFieldToastMessage || 'common:text_edit_success';
    }

    const toastMessage: IToastMessage = {
      content: toastContent,
      type: ToastType.SUCCESS,
    };
    useModalStore.getState().actions.showToast(toastMessage);

    if (callback) callback();
  } catch (error) {
    console.error('editMyProfile error:', error);

    const errorMessage: string = error?.meta?.message;
    switch (errorMessage) {
      case 'This Email is used':
        Store.store.dispatch(menuActions.setEmailEditError(i18next.t('settings:text_email_is_used')));
        break;

      case 'This phone number is used':
        Store.store.dispatch(menuActions.setPhoneNumberEditError(i18next.t('settings:text_phone_number_is_used')));
        break;

      default:
        showToastError(error);
    }
  }
};

export default editMyProfile;
