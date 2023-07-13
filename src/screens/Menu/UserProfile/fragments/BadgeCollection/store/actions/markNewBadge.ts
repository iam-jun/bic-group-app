import { cloneDeep } from 'lodash';
import groupApi from '~/api/GroupApi';
import { IUserBadgesState } from '../index';

const markNewBadge = (set, get) => async (id: string) => {
  try {
    const { badges = {} }:IUserBadgesState = get();
    if (!Boolean(badges?.[id]?.isNew)) return;
    const newBadges = cloneDeep(badges);

    await groupApi.markNewBadge([id]);

    if (newBadges[id]) {
      newBadges[id].isNew = false;
    }

    set((state: IUserBadgesState) => {
      state.badges = { ...newBadges };
    }, 'markNewBadgesSuccess');
  } catch (error) {
    console.error('markNewBadge error:', error);
  }
};

export default markNewBadge;
