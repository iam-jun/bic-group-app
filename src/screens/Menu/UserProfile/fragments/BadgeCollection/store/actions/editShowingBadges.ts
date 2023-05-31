import groupApi from '~/api/GroupApi';
import { IUserBadgesState } from '../index';
import showToast from '~/store/helper/showToast';
import { IToastMessage } from '~/interfaces/common';
import { ToastType } from '~/baseComponents/Toast/BaseToast';
import showToastError from '~/store/helper/showToastError';

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

    const response = await groupApi.putShowingBadges(ids);

    set((state: IUserBadgesState) => {
      state.loadingEditing = false;
      state.isEditing = false;
      state.showingBadges = choosingBadges;
    }, 'editShowingBadgesSuccess');
    const toastMessage: IToastMessage = {
      content: response?.meta?.message || 'common:text_edit_success',
      type: ToastType.SUCCESS,
    };
    showToast(toastMessage);
  } catch (error) {
    console.error('editShowingBadges error:', error);
    set((state: IUserBadgesState) => {
      state.loadingEditing = false;
    }, 'editShowingBadgesError');
    showToastError(error);
  }
};

export default editShowingBadges;
