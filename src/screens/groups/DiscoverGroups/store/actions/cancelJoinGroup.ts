import GroupJoinStatus from '~/constants/GroupJoinStatus';
import IDiscoverGroupsState from '../Interface';
import groupApi from '~/api/GroupApi';
import showToastSuccess from '~/store/helper/showToastSuccess';
import showToastError from '~/store/helper/showToastError';
import approveDeclineCode from '~/constants/approveDeclineCode';
import useGroupDetailStore from '~/screens/groups/GroupDetail/store';
import { ToastType } from '~/baseComponents/Toast/BaseToast';

const cancelJoinGroup = (set, get) => async (groupId: string) => {
  try {
    const currentState: IDiscoverGroupsState = get();
    const currentRequestState = currentState.items[groupId]?.joinStatus || 0;
    if (currentRequestState === GroupJoinStatus.MEMBER) return;

    const response = await groupApi.cancelJoinGroup(groupId);
    useGroupDetailStore.getState().actions.getGroupDetail({ groupId });

    // Change button join status for Discover groups screen
    set((state:IDiscoverGroupsState) => {
      state.items[groupId] = {
        ...state.items[groupId],
        joinStatus: response?.data?.joinStatus,
      };
    }, 'cancelJoinGroupSuccess');

    showToastSuccess(response);
  } catch (error) {
    console.error('cancelJoinGroup error', error);

    if (error?.code === approveDeclineCode.APPROVED) {
      useGroupDetailStore.getState().actions.getGroupDetail({ groupId });

      // Change button join status for Discover groups screen
      set((state:IDiscoverGroupsState) => {
        state.items[groupId] = {
          ...state.items[groupId],
          joinStatus: GroupJoinStatus.MEMBER,
        };
      }, 'cancelJoinGroupApproved');

      // This toast just shows info message, not really an error
      return showToastError(error, ToastType.NEUTRAL);
    }

    if (error?.code === approveDeclineCode.DECLINED) {
      useGroupDetailStore.getState().actions.getGroupDetail({ groupId });

      // Change button join status for Discover groups screen
      set((state:IDiscoverGroupsState) => {
        state.items[groupId] = {
          ...state.items[groupId],
          joinStatus: GroupJoinStatus.VISITOR,
        };
      }, 'cancelJoinGroupDeclined');

      // This toast just shows info message, not really an error
      return showToastError(error, ToastType.NEUTRAL);
    }

    showToastError(error);
  }
};

export default cancelJoinGroup;
