import groupApi from '~/api/GroupApi';
import { IUserBadgesState } from '../index';

const editShowingBadges = (set, get) => async () => {
  try {
    const { choosingBadges = [] }:IUserBadgesState = get();
    const ids = [];
    choosingBadges.forEach((badge) => {
      if (badge?.id) {
        ids.push(badge?.id);
      }
    });
    set((state: IUserBadgesState) => {
      state.loadingEditing = true;
    }, 'editShowingBadgesLoading');

    await groupApi.putShowingBadges(ids);

    set((state: IUserBadgesState) => {
      state.loadingEditing = false;
    }, 'editShowingBadgesSuccess');
  } catch (error) {
    console.error('editShowingBadges error:', error);
    set((state: IUserBadgesState) => {
      state.loadingEditing = false;
    }, 'editShowingBadgesError');
  }
};

export default editShowingBadges;
