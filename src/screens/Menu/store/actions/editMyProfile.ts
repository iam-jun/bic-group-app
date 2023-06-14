import i18next from 'i18next';
import { IUserEdit } from '~/interfaces/IAuth';
import showToastError from '~/store/helper/showToastError';
import useCommonController from '~/screens/store';
import { mapProfile } from '~/helpers/common';
import IMenuController from '../Interface';
import showToastSuccess from '~/store/helper/showToastSuccess';
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

    showToastSuccess(response);

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
