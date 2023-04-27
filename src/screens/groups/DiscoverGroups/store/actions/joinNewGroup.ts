import i18next from 'i18next';
import groupApi from '~/api/GroupApi';
import GroupJoinStatus from '~/constants/GroupJoinStatus';
import IDiscoverGroupsState from '../Interface';
import { IToastMessage } from '~/interfaces/common';
import useGroupDetailStore from '~/screens/groups/GroupDetail/store';
import showToast from '~/store/helper/showToast';
import showToastError from '~/store/helper/showToastError';
import APIErrorCode from '~/constants/apiErrorCode';
import useModalStore from '~/store/modal';
import { MembershipAnswerRequest } from '~/interfaces/ICommunity';

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

    const toastMessage: IToastMessage = {
      content: response?.meta?.message || 'common:text_success_message',
    };
    showToast(toastMessage);
  } catch (error) {
    if (error?.code === APIErrorCode.Group.MISSIING_MEMBERSHIP_ANSWERS) {
      setTimeout(
        () => {
          useModalStore.getState().actions.showAlert({
            cancelBtn: false,
            confirmLabel: i18next.t('common:text_ok'),
            title: i18next.t('common:text_sorry_something_went_wrong'),
            content: i18next.t('common:text_pull_to_refresh'),
          });
        }, 500,
      );
      return;
    }
    console.error('joinNewGroup catch', error);
    showToastError(error);
  }
};

export default joinNewGroup;
