import groupApi from '~/api/GroupApi';
import { IParamsInvitations, IPayloadInvitations } from '~/interfaces/IGroup';
import showToastError from '~/store/helper/showToastError';
import { IGroupJoinableUsersState } from '../index';
import showToastSuccess from '~/store/helper/showToastSuccess';

const invitations = (set, get) => async (params: IParamsInvitations) => {
  const {
    targetId, targetType, inviteeIds, onCallback,
  } = params;
  try {
    set((state: IGroupJoinableUsersState) => {
      state.loading = true;
    }, 'invitations Fetching');

    const payload: IPayloadInvitations = {
      targetId,
      targetType,
      inviteeIds,
    };

    const response = await groupApi.invitations(payload);

    set((state: IGroupJoinableUsersState) => {
      state.loading = false;
    }, 'invitations Success');

    onCallback();
    get().reset();
    showToastSuccess(response);
  } catch (error) {
    console.error('invitations error:', error);
    set((state: IGroupJoinableUsersState) => {
      state.loading = false;
    }, 'invitations Failed');
    onCallback();
    get().reset();
    showToastError(error);
  }
};

export default invitations;
