import groupApi from '~/api/GroupApi';
import Store from '~/storeRedux';
import { IToastMessage } from '~/interfaces/common';
import modalActions from '~/storeRedux/modal/actions';
import showError from '~/store/helper/showError';
import useGroupMemberStore from '../../GroupMembers/store';

const revokeGroupAdmin = (_set, _get) => async (groupId: string, userId: string) => {
  try {
    const response = await groupApi.removeGroupAdmin(groupId, userId);

    useGroupMemberStore
      .getState()
      .actions
      .getGroupMembers({ groupId, isRefreshing: true });

    const toastMessage: IToastMessage = {
      content: response?.meta?.message || 'common:text_success_message',
      props: { type: 'success' },
    };
    Store.store.dispatch(modalActions.showHideToastMessage(toastMessage));
  } catch (error) {
    console.error('revokeGroupAdmin error:', error);
    showError(error);
  }
};

export default revokeGroupAdmin;
