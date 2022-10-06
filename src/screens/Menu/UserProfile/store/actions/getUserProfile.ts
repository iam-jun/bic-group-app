import groupApi from '~/api/GroupApi';
import { IGetUserProfile } from '~/interfaces/IAuth';
import { mapProfile } from '~/storeRedux/menu/helper';
import IUserProfileState from '../Interface';

const getUserProfile = (set) => async ({ userId, params }: IGetUserProfile) => {
  try {
    set((state: IUserProfileState) => { state.loading = true; }, 'getUserProfile');

    const response = await groupApi.getUserProfile(userId, params);

    set((state: IUserProfileState) => {
      state.loading = false;
      state.data = mapProfile(response.data);
    }, 'getUserProfileSuccess');
  } catch (err) {
    console.error('getUserProfile error:', err);

    set((state: IUserProfileState) => {
      state.loading = false;
      state.error = err;
    }, 'getUserProfileError');
  }
};

export default getUserProfile;
