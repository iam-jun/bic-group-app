import groupApi from '~/api/GroupApi';
import { IGetUserProfile } from '~/interfaces/IAuth';
import { mapProfile } from '~/helpers/common';
import { IUserProfileState } from '../../store';
import useCommonController from '~/screens/store';
import useUserBadge, { MAX_BADGES } from '../../fragments/BadgeCollection/store';

const getUserProfile
  = (set) => async ({ userId, params, silentLoading }: IGetUserProfile) => {
    try {
      if (!silentLoading) {
        set((state: IUserProfileState) => {
          state.loading = true;
        }, 'getUserProfile');
      }

      const myId = useCommonController.getState().myProfile?.id || '';

      const response = await groupApi.getUserProfile(userId, params);
      const userProfile = mapProfile(response.data);

      set((state: IUserProfileState) => {
        state.loading = false;
        state.data = userProfile;
      }, 'getUserProfileSuccess');
      const showingBadges = response.data?.showingBadges || [];
      if (myId === userId) {
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
        useUserBadge.getState().actions.setShowingBadges(
          newShowingBadges.length > 0 ? newShowingBadges : showingBadges, true,
        );
        useCommonController.getState().actions.setMyProfile({
          ...userProfile,
          showingBadges: newShowingBadges.length > 0 ? newShowingBadges : showingBadges,
        });
      } else {
        useUserBadge.getState().actions.setShowingBadges(showingBadges, false);
      }
    } catch (err) {
      console.error('getUserProfile error:', err);

      set((state: IUserProfileState) => {
        state.loading = false;
        state.error = err;
      }, 'getUserProfileError');
    }
  };

export default getUserProfile;
