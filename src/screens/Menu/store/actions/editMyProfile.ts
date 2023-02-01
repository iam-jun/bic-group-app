import i18next from 'i18next';
import { IUserEdit } from '~/interfaces/IAuth';
import groupApi from '~/api/GroupApi';
import showToastError from '~/store/helper/showToastError';
import Store from '~/storeRedux';
import menuActions from '~/storeRedux/menu/actions';
import useCommonController from '~/screens/store';
import { mapProfile } from '~/storeRedux/menu/helper';
import showToastSuccess from '~/store/helper/showToastSuccess';

const editMyProfile = (_set) => async ({
  data,
  callback,
}: {
  data: IUserEdit;
  editFieldToastMessage?: string;
  callback?: () => void;
}) => {
  try {
    const response = await groupApi.editMyProfile(data);

    useCommonController.getState().actions.setMyProfile(mapProfile(response.data));

    showToastSuccess(response);

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
