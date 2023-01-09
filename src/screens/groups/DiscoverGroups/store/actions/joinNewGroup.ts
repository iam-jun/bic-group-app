import groupApi from '~/api/GroupApi';
import GroupJoinStatus from '~/constants/GroupJoinStatus';
import IDiscoverGroupsState from '../Interface';
import useGroupDetailStore from '~/screens/groups/GroupDetail/store';
import showToastSuccess from '~/store/helper/showToastSuccess';
import showToastError from '~/store/helper/showToastError';

const joinNewGroup = (set, get) => async (groupId: string) => {
  try {
    const currentState: IDiscoverGroupsState = get();
    const currentRequestState = currentState.items[groupId]?.joinStatus || 0;
    if (currentRequestState === GroupJoinStatus.MEMBER) return;

    const response = await groupApi.joinGroup(groupId);
    const joinStatus = response?.data?.joinStatus;

    const currentItem = {
      ...currentState.items[groupId],
      joinStatus,
    };

    set((state:IDiscoverGroupsState) => {
      state.items[groupId] = { ...currentItem };
    }, 'joinNewGroupSuccess');
    useGroupDetailStore.getState().actions.getGroupDetail({ groupId });

    showToastSuccess(response);
  } catch (error) {
    console.error('joinNewGroup catch', error);
    showToastError(error);
  }
};

export default joinNewGroup;
