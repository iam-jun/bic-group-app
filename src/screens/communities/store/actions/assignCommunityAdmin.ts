import groupApi from '~/api/GroupApi';
import showToastError from '~/store/helper/showToastError';
import showToastSuccess from '~/store/helper/showToastSuccess';
import useCommunityMemberStore from '../../CommunityMembers/store';

const assignCommunityAdmin = (_set, _get) => async (id: string, userId: string) => {
  try {
    const response = await groupApi.setGroupAdmin(id, userId);

    useCommunityMemberStore.getState().actions.getCommunityMembers(id, true);

    showToastSuccess(response);
  } catch (error) {
    console.error('assignCommunityAdmin error:', error);
    showToastError(error);
  }
};

export default assignCommunityAdmin;
