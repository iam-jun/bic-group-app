import groupApi from '~/api/GroupApi';
import showToastError from '~/store/helper/showToastError';
import showToastSuccess from '~/store/helper/showToastSuccess';
import useCommunityMemberStore from '../../CommunityMembers/store';

const revokeCommunityAdmin = (_set, _get) => async (id: string, userId: string) => {
  try {
    const response = await groupApi.removeGroupAdmin(id, userId);

    useCommunityMemberStore.getState().actions.getCommunityMembers(id, true);

    showToastSuccess(response);
  } catch (error) {
    console.error('revokeCommunityAdmin error:', error);
    showToastError(error);
  }
};

export default revokeCommunityAdmin;
