import { IGetUserProfile } from '~/interfaces/IAuth';
import { updateUserFromSharedPreferences } from '~/services/sharePreferences';
import showToastError from '~/store/helper/showToastError';
import { mapProfile } from '~/helpers/common';
import { ICommonController } from '..';
import userApi from '~/api/UserApi';

const getMyProfile = (set, _get) => async ({ userId, params }: IGetUserProfile) => {
  try {
    const response = await userApi.getUserProfile(userId, params);
    const {
      chatUserId, fullname, avatar,
    } = response.data || {};

    await updateUserFromSharedPreferences({
      id: chatUserId,
      name: fullname,
      avatar,
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
