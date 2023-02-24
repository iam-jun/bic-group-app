import i18next from 'i18next';
import { IUserEdit } from '~/interfaces/IAuth';
import groupApi from '~/api/GroupApi';
import showToastError from '~/store/helper/showToastError';
import { IToastMessage } from '~/interfaces/common';
import useCommonController from '~/screens/store';
import { mapProfile } from '~/storeRedux/menu/helper';
import showToast from '~/store/helper/showToast';
import { ToastType } from '~/baseComponents/Toast/BaseToast';
import IMenuController from '../Interface';

const editMyProfile = (_set, get) => async ({
  data,
  editFieldToastMessage,
  callback,
}: {
  data: IUserEdit;
  editFieldToastMessage?: string;
  callback?: () => void;
}) => {
  const { actions }: IMenuController = get();
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
    showToast(toastMessage);

    if (callback) callback();
  } catch (error) {
    console.error('editMyProfile error:', error);

    const errorMessage: string = error?.meta?.message;
    switch (errorMessage) {
      case 'This phone number is used':
        actions.setEditContactError(i18next.t('settings:text_phone_number_is_used'));
        break;

      default:
        showToastError(error);
    }
  }
};

export default editMyProfile;
