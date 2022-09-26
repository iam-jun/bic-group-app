import i18next from 'i18next';
import groupApi from '~/api/GroupApi';
import groupJoinStatus from '~/constants/groupJoinStatus';
import IDiscoverGroupsState from '../Interface';
import Store from '~/storeRedux';
import modalActions from '~/storeRedux/modal/actions';
import { IToastMessage } from '~/interfaces/common';

const joinNewGroup = (set, get) => async (groupId: string) => {
  try {
    const currentState: IDiscoverGroupsState = get();
    const currentRequestState = currentState.items[groupId]?.joinStatus || 0;
    if (currentRequestState === groupJoinStatus.member) return;

    const response = await groupApi.joinGroup(groupId);
    const joinStatus = response?.data?.joinStatus;
    const hasRequested = joinStatus === groupJoinStatus.requested;
    const groupName = currentState.items[groupId]?.name;

    const currentItem = {
      ...currentState.items[groupId],
      joinStatus,
    };
    set((state:IDiscoverGroupsState) => {
      state.items[groupId] = { ...currentItem };
    }, 'joinNewGroupSuccess');
    if (hasRequested) {
      const toastMessage: IToastMessage = {
        content: `${i18next.t('groups:text_request_join_group')} ${groupName}`,
      };
      Store.store.dispatch(modalActions.showHideToastMessage(toastMessage));
      return;
    }

    const toastMessage: IToastMessage = {
      content: `${i18next.t('groups:text_successfully_join_group')} ${groupName}`,
    };
    Store.store.dispatch(modalActions.showHideToastMessage(toastMessage));
  } catch (error) {
    console.error('joinNewGroup catch', error);
    Store.store.dispatch(modalActions.showHideToastMessage({
      content:
        error?.meta?.errors?.[0]?.message
        || error?.meta?.message
        || 'common:text_error_message',
      props: { type: 'error' },
    }));
  }
};

export default joinNewGroup;
