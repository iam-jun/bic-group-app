import groupApi from '~/api/GroupApi';
import { IUserBadgesState } from '../index';
import { IUserBadge } from '~/interfaces/IEditUser';

const markNewBadgeInCommunity = (set, _get) => async (badges: IUserBadge[]) => {
  try {
    if (!badges?.length) return;
    const newIds: string[] = [];
    const newBadges = {};
    badges.forEach((item) => {
      newIds.push(item.id);
      newBadges[item.id] = { ...item, isNew: false };
    });
    await groupApi.markNewBadge(newIds);

    set((state: IUserBadgesState) => {
      state.badges = { ...state.badges, ...newBadges };
    }, 'markNewBadgeInCommunity');
  } catch (error) {
    console.error('markNewBadgeInCommunity error:', error);
  }
};

export default markNewBadgeInCommunity;
