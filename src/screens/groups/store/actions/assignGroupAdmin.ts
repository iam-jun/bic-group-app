import groupApi from '~/api/GroupApi';
import { IToastMessage } from '~/interfaces/common';
import showError from '~/store/helper/showError';
import Store from '~/storeRedux';
import groupsActions from '~/storeRedux/groups/actions';
import modalActions from '~/storeRedux/modal/actions';

const assignGroupAdmin = (_set, _get) => async (groupId: string, userIds: string[]) => {
  try {
    const response = await groupApi.setGroupAdmin(groupId, userIds);

    Store.store.dispatch(
      groupsActions.getGroupMembers({ groupId, isRefreshing: true }),
    );

    const toastMessage: IToastMessage = {
      content: response?.meta?.message || 'common:text_success_message',
      props: { type: 'success' },
    };
    Store.store.dispatch(modalActions.showHideToastMessage(toastMessage));
  } catch (error) {
    console.error('assignGroupAdmin error:', error);
    showError(error);
  }
};

export default assignGroupAdmin;
