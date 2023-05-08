import i18next from 'i18next';
import { IUserEdit } from '~/interfaces/IAuth';
import groupApi from '~/api/GroupApi';
import showToastError from '~/store/helper/showToastError';
import useCommonController from '~/screens/store';
import { mapProfile } from '~/helpers/common';
import IMenuController from '../Interface';
import showToastSuccess from '~/store/helper/showToastSuccess';

const editMyProfile = (_set, get) => async ({
  isVerified,
  data,
  callback,
}: {
  isVerified
  data: IUserEdit;
  editFieldToastMessage?: string;
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

    const response = await groupApi.editMyProfile(payload);

    useCommonController.getState().actions.setMyProfile(mapProfile(response.data));

    showToastSuccess(response);

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
