import groupApi from '~/api/GroupApi';
import showToastSuccess from '~/store/helper/showToastSuccess';
import showToastError from '~/store/helper/showToastError';
import { IInvitedPeople } from '~/interfaces/IGroup';
import { IGroupJoinableUsersState } from '../index';

const cancelInvitation = (set, get) => async (invitationId: string) => {
  const { invitedPeople }: IGroupJoinableUsersState = get();
  const { data } = invitedPeople || {};

  try {
    const response = await groupApi.cancelInvitation(invitationId);

    // Update data state
    const newData = data.filter((item: IInvitedPeople) => item.id !== invitationId);

    set((state: IGroupJoinableUsersState) => {
      state.invitedPeople.data = newData;
    });

    showToastSuccess(response);
  } catch (e) {
    console.error('declineSingleCommunityMemberRequest: ', e);
    showToastError(e);
  }
};

export default cancelInvitation;
