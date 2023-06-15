import groupApi from '~/api/GroupApi';
import { IUserBadgesState, MAX_BADGES } from '../index';
import useCommonController from '~/screens/store';

const getOwnedBadges = (set, get) => async () => {
  try {
    const { actions }:IUserBadgesState = get();

    set((state: IUserBadgesState) => {
      state.loading = true;
      state.error = null;
    }, 'getMyOwnedBadgesLoading');
    const userProfileData = useCommonController.getState().myProfile;

    const response = await groupApi.getOwnedBadges();
    const { ownedBadges = [], showingBadges = [], hasNew = false } = response?.data || {};
    const newBadges = {};
    const newComBadges = [];
    ownedBadges.forEach((comBadges) => {
      const { badges } = comBadges;
      let isAllNew = true;
      badges.forEach((badge) => {
        newBadges[badge.id] = { ...badge, community: { id: comBadges.id, name: comBadges.name } };
        if (!Boolean(badge?.isNew)) {
          isAllNew = false;
        }
      });
      newComBadges.push({ ...comBadges, isNew: isAllNew });
      if (isAllNew) {
        actions.markNewBadgeInCommunity(badges);
      }
    });

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
      state.ownBadges = newComBadges;
      state.dataSearch = newComBadges;
      state.showingBadges = choosingBadges;
      state.choosingBadges = choosingBadges;
      state.hasNewBadge = hasNew;
      state.loading = false;
      state.totalBadges = totalBadges;
      state.badges = newBadges;
    }, 'getMyOwnedBadgesSuccess');
  } catch (error) {
    console.error('getOwnedBadges error:', error);
    set((state: IUserBadgesState) => {
      state.loading = false;
    }, 'getMyOwnedBadgesError');
  }
};

export default getOwnedBadges;
