import groupApi from '~/api/GroupApi';
import { IGetUserProfile } from '~/interfaces/IAuth';
import { mapProfile } from '~/helpers/common';
import { IUserProfileState } from '../../store';
import useCommonController from '~/screens/store';
import useUserBadge from '../../fragments/BadgeCollection/store';

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
      if (myId === userId) {
        useCommonController.getState().actions.setMyProfile(userProfile);
      }
      useUserBadge.getState().actions.setShowingBadges(userProfile?.showingBadges);
    } catch (err) {
      console.error('getUserProfile error:', err);

      set((state: IUserProfileState) => {
        state.loading = false;
        state.error = err;
      }, 'getUserProfileError');
    }
  };

export default getUserProfile;
