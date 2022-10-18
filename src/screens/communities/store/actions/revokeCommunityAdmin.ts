import groupApi from '~/api/GroupApi';
import { IToastMessage } from '~/interfaces/common';
import showError from '~/store/helper/showError';
import Store from '~/storeRedux';
import groupsActions from '~/storeRedux/groups/actions';
import modalActions from '~/storeRedux/modal/actions';

const revokeCommunityAdmin = (_set, _get) => async (communityId: string, userIds: string[]) => {
  try {
    const response = await groupApi.revokeCommunityAdmin(communityId, userIds);

    Store.store.dispatch(
      groupsActions.getCommunityMembers({ communityId, isRefreshing: true }),
    );

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
