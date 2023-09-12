import showToastError from '~/store/helper/showToastError';
import { IMyInvitationsStore } from '../index';
import groupApi from '~/api/GroupApi';
import showToastSuccess from '~/store/helper/showToastSuccess';

const acceptInvitation = (set, get) => async (invitationId: string, inviGroupId:number) => {
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
    newGroupedInvitations[groupedIndex].data = [];
  } else {
    newGroupedInvitations[groupedIndex].data = newGroupedData;
  }

  try {
    const { requestingsAccept }: IMyInvitationsStore = get();
    if (requestingsAccept[invitationId]) return;

    set((state: IMyInvitationsStore) => {
      state.requestingsAccept[invitationId] = true;
    }, 'requestingAcceptInvitation');

    const response = await groupApi.acceptInvitation(invitationId);

    set((state: IMyInvitationsStore) => {
      delete state.requestingsAccept[invitationId];
      state.requestSent[invitationId] = true;
      state.groupedInvitations = newGroupedInvitations;
    }, 'acceptInvitation');
    showToastSuccess(response);
  } catch (err) {
    set((state: IMyInvitationsStore) => {
      delete state.requestingsAccept[invitationId];
      state.requestSent[invitationId] = true;
      state.groupedInvitations = newGroupedInvitations;
    }, 'acceptInvitationError');
    console.error(
      '\x1b[33m', ' acceptInvitation error', err, '\x1b[0m',
    );
    showToastError(err);
  }
};

export default acceptInvitation;
