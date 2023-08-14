import showToastError from '~/store/helper/showToastError';
import { IMyInvitationsStore } from '../index';
import groupApi from '~/api/GroupApi';
import showToastSuccess from '~/store/helper/showToastSuccess';

const declineInvitation = (set, get) => async (invitationId: string) => {
  if (!invitationId) return;
  try {
    const { requestingsDecline }: IMyInvitationsStore = get();
    if (requestingsDecline[invitationId]) return;

    set((state: IMyInvitationsStore) => {
      state.requestingsDecline[invitationId] = true;
    }, 'requestingDeclineInvitation');

    const response = await groupApi.declineInvitation(invitationId);

    set((state: IMyInvitationsStore) => {
      delete state.requestingsDecline[invitationId];
      state.declined[invitationId] = true;
    }, 'declineInvitation');
    showToastSuccess(response);
  } catch (err) {
    set((state: IMyInvitationsStore) => {
      delete state.requestingsDecline[invitationId];
    }, 'declineInvitationError');
    console.error(
      '\x1b[33m', ' declineInvitation error', err, '\x1b[0m',
    );
    showToastError(err);
  }
};

export default declineInvitation;
