import showToastError from '~/store/helper/showToastError';
import { IMyInvitationsStore } from '../index';
import groupApi from '~/api/GroupApi';
import showToastSuccess from '~/store/helper/showToastSuccess';

const declineInvitation = (set, get) => async (invitationId: string, inviGroupId: number) => {
  if (!invitationId) return;
  const { requestingsDecline, groupedInvitations }: IMyInvitationsStore = get();
  if (!groupedInvitations?.length || requestingsDecline[invitationId]) return;

  const groupedIndex = groupedInvitations.findIndex((item) => item.id === inviGroupId);
  if (groupedIndex === -1) return;

  const invitationIndex = groupedInvitations[groupedIndex].data.findIndex((item) => item === invitationId);
  if (invitationIndex === -1) return;

  const newGroupedData = [...groupedInvitations[groupedIndex].data];
  newGroupedData.splice(invitationIndex, 1);

  const newGroupedInvitations = [...groupedInvitations];
  if (!newGroupedData.length) {
    newGroupedInvitations[groupedIndex].data.splice(groupedIndex, 1);
  } else {
    newGroupedInvitations[groupedIndex].data = newGroupedData;
  }

  try {
    set((state: IMyInvitationsStore) => {
      state.requestingsDecline[invitationId] = true;
    }, 'requestingDeclineInvitation');

    const response = await groupApi.declineInvitation(invitationId);

    set((state: IMyInvitationsStore) => {
      delete state.requestingsDecline[invitationId];
      state.requestSent[invitationId] = true;
      state.groupedInvitations = newGroupedInvitations;
    }, 'declineInvitation');
    showToastSuccess(response);
  } catch (err) {
    set((state: IMyInvitationsStore) => {
      delete state.requestingsDecline[invitationId];
      state.requestSent[invitationId] = true;
      state.groupedInvitations = newGroupedInvitations;
    }, 'declineInvitationError');
    console.error(
      '\x1b[33m', ' declineInvitation error', err, '\x1b[0m',
    );
    showToastError(err);
  }
};

export default declineInvitation;
