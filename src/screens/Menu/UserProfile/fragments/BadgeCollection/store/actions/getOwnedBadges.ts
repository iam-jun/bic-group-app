import groupApi from '~/api/GroupApi';
import { IUserBadgesState, MAX_BADGES } from '../index';

const getOwnedBadges = (set, _get) => async () => {
  try {
    set((state: IUserBadgesState) => {
      state.loading = true;
      state.error = null;
    }, 'getMyOwnedBadgesLoading');

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

    set((state: IUserBadgesState) => {
      state.ownBadges = ownedBadges;
      state.showingBadges = choosingBadges;
      state.choosingBadges = choosingBadges;
      state.loading = false;
    }, 'getMyOwnedBadgesSuccess');
  } catch (error) {
    console.error('getOwnedBadges error:', error);
    set((state: IUserBadgesState) => {
      state.loading = false;
    }, 'getMyOwnedBadgesError');
  }
};

export default getOwnedBadges;
