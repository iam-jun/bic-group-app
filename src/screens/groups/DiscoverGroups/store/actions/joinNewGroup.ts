import groupApi from '~/api/GroupApi';
import GroupJoinStatus from '~/constants/GroupJoinStatus';
import IDiscoverGroupsState from '../Interface';
import { IToastMessage } from '~/interfaces/common';
import useGroupDetailStore from '~/screens/groups/GroupDetail/store';
import showToast from '~/store/helper/showToast';
import showToastError from '~/store/helper/showToastError';

const joinNewGroup = (set, get) => async (groupId: string) => {
  try {
    const currentState: IDiscoverGroupsState = get();
    const currentRequestState = currentState.items[groupId]?.joinStatus || 0;
    if (currentRequestState === GroupJoinStatus.MEMBER) return;

    const response = await groupApi.joinGroup(groupId, { membershipAnswers: [] });
    const joinStatus = response?.data?.joinStatus;

    const currentItem = {
      ...currentState.items[groupId],
      joinStatus,
    };
    set((state:IDiscoverGroupsState) => {
      state.items[groupId] = { ...currentItem };
    }, 'joinNewGroupSuccess');
    useGroupDetailStore.getState().actions.getGroupDetail({ groupId });

    const toastMessage: IToastMessage = {
      content: response?.meta?.message || 'common:text_success_message',
    };
    showToast(toastMessage);
  } catch (error) {
    console.error('joinNewGroup catch', error);
    showToastError(error);
  }
};

export default joinNewGroup;
