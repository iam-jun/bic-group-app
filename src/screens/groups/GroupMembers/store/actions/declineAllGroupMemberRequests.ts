import i18next from 'i18next';
import { IToastMessage } from '~/interfaces/common';
import { IPayloadDeclineAllGroupMemberRequests } from '~/interfaces/IGroup';
import showToastError from '~/store/helper/showToastError';
import groupApi from '~/api/GroupApi';
import showToast from '~/store/helper/showToast';
import { IGroupMemberState } from '..';

export const declineAllGroupMemberRequests = (get) => async (
  payload: IPayloadDeclineAllGroupMemberRequests,
) => {
  const { groupId, total } = payload || {};
  const { actions }: IGroupMemberState = get();

  try {
    if (!groupId) return;

    await groupApi.declineAllGroupMemberRequests(groupId);
    actions.resetUndoGroupMemberRequests();

    const toastMessage: IToastMessage = {
      // TO BE REPLACED SOON, SHOULD USE MESSAGE FROM BE
      content: `${i18next.t('groups:text_declined_all')}`.replace('{0}', total.toString()),
    };
    showToast(toastMessage);
  } catch (e) {
    console.error('declineAllGroupMemberRequests: ', e);
    showToastError(e);
  }
};

export default declineAllGroupMemberRequests;
