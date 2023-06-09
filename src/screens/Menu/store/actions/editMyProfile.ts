import i18next from 'i18next';
import { IUserEdit } from '~/interfaces/IAuth';
import showToastError from '~/store/helper/showToastError';
import { IToastMessage } from '~/interfaces/common';
import useCommonController from '~/screens/store';
import { mapProfile } from '~/helpers/common';
import showToast from '~/store/helper/showToast';
import { ToastType } from '~/baseComponents/Toast/BaseToast';
import IMenuController from '../Interface';
import userApi from '~/api/UserApi';

const editMyProfile = (_set, get) => async ({
  isVerified,
  data,
  callback,
}: {
  isVerified
  data: IUserEdit;
  callback?: () => void;
}) => {
  const { actions }: IMenuController = get();
  try {
    const payload = data;
    if (!!isVerified) {
      delete payload?.fullname;
      delete payload?.gender;
      delete payload?.birthday;
    }

    const response = await userApi.editMyProfile(payload);

    useCommonController.getState().actions.setMyProfile(mapProfile(response.data));

    const toastMessage: IToastMessage = {
      content: response?.meta?.message || 'common:text_edit_success',
      type: ToastType.SUCCESS,
    };
    showToast(toastMessage);

    if (callback) callback();
  } catch (error) {
    console.error('editMyProfile error:', error);

    const errorMessage: string = error?.meta?.message;
    if (errorMessage === 'This phone number is used') {
      actions.setEditContactError(i18next.t('settings:text_phone_number_is_used'));
    } else {
      showToastError(error);
    }
  }
};

export default editMyProfile;
