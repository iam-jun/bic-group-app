import groupApi from '~/api/GroupApi';
import { IUserBadgesState, MAX_BADGES } from '../index';
import showToast from '~/store/helper/showToast';
import { IToastMessage } from '~/interfaces/common';
import { ToastType } from '~/baseComponents/Toast/BaseToast';
import showToastError from '~/store/helper/showToastError';
import useCommonController from '~/screens/store';
import { IUserProfile } from '~/interfaces/IAuth';
import { IUserBadge } from '~/interfaces/IEditUser';

const sortChoosingBadgesByOrder = (choosingBadges: IUserBadge[], choosingBadgesOrder: number[]) => {
  const newChoosingBadges = [];
  choosingBadgesOrder.forEach((order) => {
    newChoosingBadges.push(choosingBadges[order]);
  });
  return newChoosingBadges;
};

const editShowingBadges = (set, get) => async () => {
  const {
    choosingBadges = [], ownBadges, actions, choosingBadgesOrder,
  }:IUserBadgesState = get();
  try {
    const ids = [];
    const showingBadges = [];

    const choosingBadgesOrderSorted = sortChoosingBadgesByOrder(choosingBadges, choosingBadgesOrder);

    choosingBadgesOrderSorted.forEach((badge) => {
      if (badge?.id) {
        ids.push(badge?.id);
        showingBadges.push(badge);
      }
    });
    if (showingBadges.length > 0 && showingBadges.length < 3) {
      for (let index = 0; index < MAX_BADGES; index++) {
        if (!Boolean(showingBadges?.[index]?.id)) {
          showingBadges.push(undefined);
        }
      }
    }
    set((state: IUserBadgesState) => {
      state.loadingEditing = true;
    }, 'editShowingBadgesLoading');

    const response = await groupApi.putShowingBadges(ids);

    set((state: IUserBadgesState) => {
      state.loadingEditing = false;
      state.isEditing = false;
      state.showingBadges = showingBadges;
      state.choosingBadges = showingBadges;
      state.dataSearch = ownBadges;
    }, 'editShowingBadgesSuccess');
    actions.resetChoosingBadgesOrder();

    const { myProfile } = useCommonController.getState();
    const newProfile: IUserProfile = { ...myProfile, showingBadges: ids.length > 0 ? showingBadges : [] };
    useCommonController.getState().actions.setMyProfile(newProfile);

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
    actions.resetChoosingBadgesOrder();
  }
};

export default editShowingBadges;
