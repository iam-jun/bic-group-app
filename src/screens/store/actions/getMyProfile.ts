import groupApi from '~/api/GroupApi';
import { IGetUserProfile } from '~/interfaces/IAuth';
import { updateUserFromSharedPreferences } from '~/services/sharePreferences';
import showToastError from '~/store/helper/showToastError';
import { mapProfile } from '~/helpers/common';
import { ICommonController } from '..';
import useUserBadge, { MAX_BADGES } from '~/screens/Menu/UserProfile/fragments/BadgeCollection/store';

const getMyProfile = (set, _get) => async ({ userId, params }: IGetUserProfile) => {
  try {
    const response = await groupApi.getUserProfile(userId, params);
    const {
      showingBadges, chatUserId, fullname, avatar,
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
      useUserBadge.getState().actions.setShowingBadges(newShowingBadges, true);
    }
    set((state: ICommonController) => {
      state.myProfile = {
        ...mapProfile(response.data),
        showingBadges: newShowingBadges.length > 0 ? newShowingBadges : showingBadges,
      };
    }, 'getMyProfileSuccess');
  } catch (error) {
    console.error('getMyProfile error:', error);
    showToastError(error);
  }
};

export default getMyProfile;
