import i18next from 'i18next';
import { IPayloadApproveAllGroupMemberRequests } from '~/interfaces/IGroup';
import { IToastMessage } from '~/interfaces/common';
import useGroupDetailStore from '~/screens/groups/GroupDetail/store';
import showToast from '~/store/helper/showToast';
import showToastError from '~/store/helper/showToastError';
import groupApi from '~/api/GroupApi';
import { IGroupMemberState } from '..';

const approveAllGroupMemberRequests = (get) => async (
  payload: IPayloadApproveAllGroupMemberRequests,
) => {
  const { groupId, total } = payload || {};
  const { actions }: IGroupMemberState = get();

  try {
    if (!groupId) return;

    actions.resetGroupMemberRequests();

    // to show Empty screen component
    actions.setGroupMemberRequests({ loading: false });

    await groupApi.approveAllGroupMemberRequests(groupId);

    // to update userCount
    useGroupDetailStore.getState().actions.getGroupDetail({ groupId });

    const toastMessage: IToastMessage = {
      // TO BE REPLACED SOON, SHOULD USE MESSAGE FROM BE
      content: `${i18next.t('groups:text_approved_all')}`.replace('{0}', total.toString()),
    };
    showToast(toastMessage);
  } catch (e) {
    console.error('approveAllGroupMemberRequests: ', e);
    showToastError(e);
  }
};

export default approveAllGroupMemberRequests;
