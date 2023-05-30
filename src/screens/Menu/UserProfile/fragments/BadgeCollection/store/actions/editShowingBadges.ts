import groupApi from '~/api/GroupApi';
import { IUserBadgesState } from '../index';

const editShowingBadges = (set, get) => async () => {
  try {
    const { choosingBadges = [] }:IUserBadgesState = get();
    set((state: IUserBadgesState) => {
      state.loadingEditing = true;
    }, 'editShowingBadgesLoading');

    await groupApi.putShowingBadges(choosingBadges);

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
