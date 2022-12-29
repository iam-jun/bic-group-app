import i18next from 'i18next';
import groupApi from '~/api/GroupApi';
import GroupJoinStatus from '~/constants/GroupJoinStatus';
import IDiscoverGroupsState from '../Interface';
import { IToastMessage } from '~/interfaces/common';
import useGroupDetailStore from '~/screens/groups/GroupDetail/store';
import useModalStore from '~/store/modal';
import showToastError from '~/store/helper/showToastError';

const joinNewGroup = (set, get) => async (groupId: string) => {
  try {
    const currentState: IDiscoverGroupsState = get();
    const currentRequestState = currentState.items[groupId]?.joinStatus || 0;
    if (currentRequestState === GroupJoinStatus.MEMBER) return;

    const response = await groupApi.joinGroup(groupId);
    const joinStatus = response?.data?.joinStatus;
    const hasRequested = joinStatus === GroupJoinStatus.REQUESTED;
    const groupName = currentState.items[groupId]?.name;

    const currentItem = {
      ...currentState.items[groupId],
      joinStatus,
    };
    set((state:IDiscoverGroupsState) => {
      state.items[groupId] = { ...currentItem };
    }, 'joinNewGroupSuccess');
    useGroupDetailStore.getState().actions.getGroupDetail({ groupId });

    if (hasRequested) {
      const toastMessage: IToastMessage = {
        content: `${i18next.t('groups:text_request_join_group')} ${groupName}`,
      };
      useModalStore.getState().actions.showToast(toastMessage);
      return;
    }

    const toastMessage: IToastMessage = {
      content: `${i18next.t('groups:text_successfully_join_group')} ${groupName}`,
    };
    useModalStore.getState().actions.showToast(toastMessage);
  } catch (error) {
    console.error('joinNewGroup catch', error);
    showToastError(error);
  }
};

export default joinNewGroup;
