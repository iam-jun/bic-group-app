import groupApi from '~/api/GroupApi';
import { IUserBadgesState, MAX_BADGES } from '../index';
import useCommonController from '~/screens/store';

const getOwnedBadges = (set, _get) => async () => {
  try {
    set((state: IUserBadgesState) => {
      state.loading = true;
      state.error = null;
    }, 'getMyOwnedBadgesLoading');
    const userProfileData = useCommonController.getState().myProfile;

    const response = await groupApi.getOwnedBadges();
    const { ownedBadges = [], showingBadges = [] } = response?.data || {};
    const choosingBadges = [];
    for (let index = 0; index < MAX_BADGES; index++) {
      if (!showingBadges?.[index]) {
        choosingBadges.push(undefined);
      } else {
        choosingBadges.push(showingBadges[index]);
      }
    }

    let totalBadges = 0;
    ownedBadges.forEach((community) => {
      totalBadges += (community?.badges?.length || 0);
    });

    set((state: IUserBadgesState) => {
      state.ownBadges = ownedBadges;
      state.dataSearch = ownedBadges;
      state.showingBadges = choosingBadges;
      state.choosingBadges = choosingBadges;
      state.loading = false;
      state.totalBadges = totalBadges;
    }, 'getMyOwnedBadgesSuccess');
  } catch (error) {
    console.error('getOwnedBadges error:', error);
    set((state: IUserBadgesState) => {
      state.loading = false;
    }, 'getMyOwnedBadgesError');
  }
};

export default getOwnedBadges;
