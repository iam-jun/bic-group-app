import groupApi from '~/api/GroupApi';
import showToastSuccess from '~/store/helper/showToastSuccess';
import showToastError from '~/store/helper/showToastError';
import { INotiInvitationsStore } from '../index';
import APIErrorCode from '~/constants/apiErrorCode';

const declineInvitation = (set, get) => async (notiInfo: any) => {
  const { id: notificationId, activities } = notiInfo || {};
  const invitationId = activities[0]?.invitation?.invitationId || '';
  if (!notificationId || !invitationId) return;
  try {
    const { requestingsDecline }: INotiInvitationsStore = get();
    if (requestingsDecline[notificationId]) return;

    set((state: INotiInvitationsStore) => {
      state.requestingsDecline[notificationId] = true;
    }, 'requestingDeclineInvitationNotification');

    const response = await groupApi.declineInvitation(invitationId);

    set((state: INotiInvitationsStore) => {
      delete state.requestingsDecline[notificationId];
      state.declined[notificationId] = true;
    }, 'declineInvitationNotification');
    showToastSuccess(response);
  } catch (error) {
    set((state: INotiInvitationsStore) => {
      delete state.requestingsDecline[notificationId];
    }, 'declineInvitationNotificationError');
    console.error(
      '\x1b[33m', 'notification declineInvitation error', error, '\x1b[0m',
    );
    if (
      error?.code === APIErrorCode.Group.INVITATION_IS_ALREADY_SENT_DECLINED
    ) {
      set((state: INotiInvitationsStore) => {
        state.alreadyDeclined[notificationId] = true;
      }, 'acceptInvitationNotificationAlreadySent');
    }
    showToastError(error);
  }
};

export default declineInvitation;
