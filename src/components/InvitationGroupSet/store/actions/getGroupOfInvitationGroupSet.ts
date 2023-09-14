import groupApi from '~/api/GroupApi';
import { IGroupSetInvitationsStore } from '../index';

const countGroups = (data: any) => {
  let count = 0;

  const traverse = (node: any) => {
    if (node.children.length === 0) {
      return;
    }
    count += node.children.length;
    node.children.forEach((child) => {
      traverse(child);
    });
  };

  traverse(data);
  return count + 1;
};

const getGroupOfInvitationGroupSet = (set, _get) => async (invitationId: string, isRefresh?: boolean) => {
  try {
    set((state: IGroupSetInvitationsStore) => {
      state.loading = !isRefresh;
      state.isRefresing = !!isRefresh;
    }, 'getGroupOfInvitationGroupSet');

    const response = await groupApi.getGroupSetOfInvitation(invitationId);
    const totalGroups = countGroups(response?.data?.target);

    set((state: IGroupSetInvitationsStore) => {
      state.loading = false;
      state.isRefresing = false;
      state.data = [response?.data?.target];
      state.totalGroups = totalGroups;
    }, 'getGroupOfInvitationGroupSetSuccess');
  } catch (err) {
    set((state: IGroupSetInvitationsStore) => {
      state.loading = false;
      state.isRefresing = false;
    }, 'getGroupOfInvitationGroupSetError');
    console.error(
      '\x1b[33m', 'get groups in group set Invitations error', err, '\x1b[0m',
    );
  }
};

export default getGroupOfInvitationGroupSet;
