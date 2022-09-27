import i18next from 'i18next';
import groupJoinStatus from '~/constants/groupJoinStatus';
import IDiscoverGroupsState from '../Interface';
import Store from '~/storeRedux';
import groupsActions from '~/storeRedux/groups/actions';
import groupApi from '~/api/GroupApi';
import { IToastMessage } from '~/interfaces/common';
import modalActions from '~/storeRedux/modal/actions';

const cancelJoinGroup = (set, get) => async (groupId: string) => {
  try {
    const currentState: IDiscoverGroupsState = get();
    const currentRequestState = currentState.items[groupId]?.joinStatus || 0;
    if (currentRequestState === groupJoinStatus.member) return;
    const groupName = currentState.items[groupId]?.name;

    groupApi.cancelJoinGroup(groupId);
    Store.store.dispatch(groupsActions.getGroupDetail({ groupId }));

    const currentItem = {
      ...currentState.items[groupId],
      joinStatus: groupJoinStatus.visitor,
    };
    set((state:IDiscoverGroupsState) => {
      state.items[groupId] = { ...currentItem };
    }, 'cancelJoinGroupSuccess');

    const toastMessage: IToastMessage = {
      content: `${i18next.t('groups:text_cancel_join_group')} ${groupName}`,
    };

    Store.store.dispatch(modalActions.showHideToastMessage(toastMessage));
  } catch (err) {
    console.error('cancelJoinGroup error', err);
    if (
      err?.meta?.message
      === 'You have been approved to be a member of this group'
    ) {
      const toastMessage: IToastMessage = {
        content: `${i18next.t('groups:text_approved_member_group')}`,
      };
      Store.store.dispatch(modalActions.showHideToastMessage(toastMessage));
      Store.store.dispatch(groupsActions.getGroupDetail({
        groupId,
        loadingPage: true,
      }));

      return;
    }

    Store.store.dispatch(modalActions.showHideToastMessage({
      content:
        err?.meta?.errors?.[0]?.message
        || err?.meta?.message
        || 'common:text_error_message',
      props: { type: 'error' },
    }));
  }
};

export default cancelJoinGroup;
