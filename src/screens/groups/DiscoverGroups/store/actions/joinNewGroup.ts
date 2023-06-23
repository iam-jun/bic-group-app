import groupApi from '~/api/GroupApi';
import GroupJoinStatus from '~/constants/GroupJoinStatus';
import IDiscoverGroupsState from '../Interface';
import useGroupDetailStore from '~/screens/groups/GroupDetail/store';
import showToastSuccess from '~/store/helper/showToastSuccess';
import showToastError from '~/store/helper/showToastError';
import APIErrorCode from '~/constants/apiErrorCode';
import { MembershipAnswerRequest } from '~/interfaces/ICommunity';
import { showAlertRefreshPage } from '~/helpers/common';

const joinNewGroup = (set, get) => async (groupId: string, answers?: MembershipAnswerRequest[]) => {
  try {
    const currentState: IDiscoverGroupsState = get();
    const currentRequestState = currentState.items[groupId]?.joinStatus || 0;
    if (currentRequestState === GroupJoinStatus.MEMBER) return;

    const response = await groupApi.joinGroup(
      groupId,
      { membershipAnswers: answers?.length > 0 ? answers : [] },
    );
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
    if (
      error?.code === APIErrorCode.Group.MISSIING_MEMBERSHIP_ANSWERS
      || error?.code === APIErrorCode.Common.FORBIDDEN
    ) {
      showAlertRefreshPage();
      return;
    }
    console.error('joinNewGroup catch', error);
    showToastError(error);
  }
};

export default joinNewGroup;
