import groupApi from '~/api/GroupApi';
import { IGetUserProfile } from '~/interfaces/IAuth';
import { updateUserFromSharedPreferences } from '~/services/sharePreferences';
import showError from '~/store/helper/showError';
import { mapProfile } from '~/storeRedux/menu/helper';
import { ICommonController } from '..';

const getMyProfile = (set, _get) => async ({ userId, params }: IGetUserProfile) => {
  try {
    const response = await groupApi.getUserProfile(userId, params);

    await updateUserFromSharedPreferences({
      name: response?.data?.fullname,
      avatar: response?.data?.avatar,
    });

    set((state: ICommonController) => {
      state.myProfile = mapProfile(response.data);
    }, 'getMyProfileSuccess');
  } catch (error) {
    console.error('getMyProfile error:', error);
    showError(error);
  }
};

export default getMyProfile;
