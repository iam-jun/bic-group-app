import groupApi from '~/api/GroupApi';
import showToastSuccess from '~/store/helper/showToastSuccess';
import showToastError from '~/store/helper/showToastError';
import { INotiInvitationsStore } from '../index';
import APIErrorCode from '~/constants/apiErrorCode';

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
      state.needToChangeNote[notificationId] = true;
      state.textNotedList[notificationId] = 'notification:text_invitation_accepted';
    }, 'acceptInvitationNotification');
    showToastSuccess(response);
  } catch (error) {
    set((state: INotiInvitationsStore) => {
      delete state.requestingsAccept[notificationId];
    }, 'acceptInvitationNotificationError');
    console.error(
      '\x1b[33m', 'notification acceptInvitation error', error, '\x1b[0m',
    );
    if (
      error?.code === APIErrorCode.Group.INVITATION_IS_ALREADY_SENT_ACCEPTED
    ) {
      set((state: INotiInvitationsStore) => {
        state.needToChangeNote[notificationId] = true;
        state.textNotedList[notificationId] = 'notification:text_you_have_previously_joined';
      }, 'acceptInvitationNotificationAlreadySent');
    }
    if (error?.code === APIErrorCode.Group.INVITATION_IS_ALREADY_CANCELLED) {
      set((state: INotiInvitationsStore) => {
        state.needToChangeNote[notificationId] = true;
        state.textNotedList[notificationId] = 'notification:text_invitation_has_been_canceled';
      }, 'acceptInvitationNotificationAlreadySent');
    }
    showToastError(error);
  }
};

export default acceptInvitation;
