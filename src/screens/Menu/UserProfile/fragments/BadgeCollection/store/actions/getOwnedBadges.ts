import groupApi from '~/api/GroupApi';
import { IUserBadgesState } from '../index';

const getOwnedBadges = (set, _get) => async () => {
  try {
    set((state: IUserBadgesState) => {
      state.loading = true;
      state.error = null;
    }, 'getMyOwnedBadgesLoading');

    const response = await groupApi.getOwnedBadges();
    const { ownedBadges = [], showingBadges = [] } = response?.data || {};
    const choosingBadges = showingBadges?.length > 0 ? showingBadges : [undefined, undefined, undefined];

    set((state: IUserBadgesState) => {
      state.ownBadges = ownedBadges;
      state.showingBadges = showingBadges;
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
