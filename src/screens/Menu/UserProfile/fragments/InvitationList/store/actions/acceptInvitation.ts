import showToastError from '~/store/helper/showToastError';
import { IMyInvitationsStore } from '../index';
import groupApi from '~/api/GroupApi';
import showToastSuccess from '~/store/helper/showToastSuccess';

const acceptInvitation = (set, get) => async (invitationId: string) => {
  if (!invitationId) return;
  try {
    const { requestingsAccept }: IMyInvitationsStore = get();
    if (requestingsAccept[invitationId]) return;

    set((state: IMyInvitationsStore) => {
      state.requestingsAccept[invitationId] = true;
    }, 'requestingAcceptInvitation');

    const response = await groupApi.acceptInvitation(invitationId);

    set((state: IMyInvitationsStore) => {
      delete state.requestingsAccept[invitationId];
      state.accepted[invitationId] = true;
    }, 'acceptInvitation');
    showToastSuccess(response);
  } catch (err) {
    set((state: IMyInvitationsStore) => {
      delete state.requestingsAccept[invitationId];
    }, 'acceptInvitationError');
    console.error(
      '\x1b[33m', ' acceptInvitation error', err, '\x1b[0m',
    );
    showToastError(err);
  }
};

export default acceptInvitation;
