import { IGetUserProfile } from '~/interfaces/IAuth';
import { updateUserFromSharedPreferences } from '~/services/sharePreferences';
import showToastError from '~/store/helper/showToastError';
import { mapProfile } from '~/helpers/common';
import { ICommonController } from '..';
import userApi from '~/api/UserApi';
import { MAX_BADGES } from '~/screens/Menu/UserProfile/fragments/BadgeCollection/store';

const getMyProfile = (set, get) => async ({ userId, params }: IGetUserProfile) => {
  try {
    const myProfile = get() || {};
    const response = await userApi.getUserProfile(userId, params);
    const {
      chatUserId, fullname, avatar, showingBadges,
    } = response.data || {};

    await updateUserFromSharedPreferences({
      id: chatUserId,
      name: fullname,
      avatar,
    });

    const newShowingBadges = [];
    if (showingBadges?.length < MAX_BADGES) {
      for (let index = 0; index < MAX_BADGES; index++) {
        if (showingBadges?.[index]) {
          newShowingBadges.push(showingBadges[index]);
        } else {
          newShowingBadges.push(undefined);
        }
      }
    }

    set((state: ICommonController) => {
      state.myProfile = {
        ...mapProfile(response.data),
        showingBadges: myProfile?.showingBadges || newShowingBadges,
      };
    }, 'getMyProfileSuccess');
  } catch (error) {
    console.error('getMyProfile error:', error);
    showToastError(error);
  }
};

export default getMyProfile;
