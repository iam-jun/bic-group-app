import groupApi from '~/api/GroupApi';
import showToastSuccess from '~/store/helper/showToastSuccess';
import showToastError from '~/store/helper/showToastError';
import { INotiInvitationsStore } from '../index';

const acceptInvitation = (set, get) => async (notiInfo: any) => {
  const { id: notificationId, activities } = notiInfo || {};
  const invitationId = activities[0]?.invitation?.invitationId || '';
  if (!notificationId || !invitationId) return;
  try {
    const { requestingsAccept }: INotiInvitationsStore = get();
    if (requestingsAccept[notificationId]) return;

    set((state: INotiInvitationsStore) => {
      state.requestingsAccept[notificationId] = true;
    }, 'requestingAcceptInvitationNotification');

    const response = await groupApi.acceptInvitation(invitationId);

    set((state: INotiInvitationsStore) => {
      delete state.requestingsAccept[notificationId];
      state.accepted[notificationId] = true;
    }, 'acceptInvitationNotification');
    showToastSuccess(response);
  } catch (err) {
    set((state: INotiInvitationsStore) => {
      delete state.requestingsAccept[notificationId];
    }, 'acceptInvitationNotificationError');
    console.error(
      '\x1b[33m', 'notification acceptInvitation error', err, '\x1b[0m',
    );
    showToastError(err);
  }
};

export default acceptInvitation;
