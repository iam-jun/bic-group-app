import groupApi from '~/api/GroupApi';
import { IToastMessage } from '~/interfaces/common';
import showError from '~/store/helper/showError';
import Store from '~/storeRedux';
import modalActions from '~/storeRedux/modal/actions';
import useCommunityMemberStore from '../../CommunityMembers/store';

const revokeCommunityAdmin = (_set, _get) => async (id: string, userId: string) => {
  try {
    const response = await groupApi.removeGroupAdmin(id, userId);

    useCommunityMemberStore.getState().actions.getCommunityMembers(id, true);

    const toastMessage: IToastMessage = {
      content: response?.meta?.message || 'common:text_success_message',
      props: { type: 'success' },
    };
    Store.store.dispatch(modalActions.showHideToastMessage(toastMessage));
  } catch (error) {
    console.error('revokeCommunityAdmin error:', error);
    showError(error);
  }
};

export default revokeCommunityAdmin;
