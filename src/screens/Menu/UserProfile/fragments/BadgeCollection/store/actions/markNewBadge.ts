import groupApi from '~/api/GroupApi';
import { IUserBadgesState } from '../index';

const markNewBadge = (set, get) => async (id: string) => {
  try {
    const { badges = {} }:IUserBadgesState = get();
    await groupApi.markNewBadge([id]);

    if (badges?.[id]) {
      badges[id].isNew = false;
    }

    set((state: IUserBadgesState) => {
      state.badges = badges;
    }, 'markNewBadgesSuccess');
  } catch (error) {
    console.error('markNewBadge error:', error);
  }
};

export default markNewBadge;
