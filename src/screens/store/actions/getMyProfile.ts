import groupApi from '~/api/GroupApi';
import { IGetUserProfile } from '~/interfaces/IAuth';
import { updateUserFromSharedPreferences } from '~/services/sharePreferences';
import showToastError from '~/store/helper/showToastError';
import { mapProfile } from '~/helpers/common';
import { ICommonController } from '..';

const getMyProfile = (set, _get) => async ({ userId, params }: IGetUserProfile) => {
  try {
    const response = await groupApi.getUserProfile(userId, params);

    await updateUserFromSharedPreferences({
      id: response?.data?.chatUserId,
      name: response?.data?.fullname,
      avatar: response?.data?.avatar,
    });

    set((state: ICommonController) => {
      state.myProfile = mapProfile(response.data);
    }, 'getMyProfileSuccess');
  } catch (error) {
    console.error('getMyProfile error:', error);
    showToastError(error);
  }
};

export default getMyProfile;
