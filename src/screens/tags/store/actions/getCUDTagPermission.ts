import groupApi from '~/api/GroupApi';
import showToastError from '~/store/helper/showToastError';
import { ITagsController } from '..';

const getCommunityCUDTagPermission = (set, _get) => async (communityId: string) => {
  try {
    const response = await groupApi.getCommunityCUDTagPermission(communityId);
    set((state: ITagsController) => {
      state.communityCUDTagPermissions[communityId] = response.data;
    }, 'getCommunityCUDTagPermissionSuccess');
  } catch (error) {
    console.error('getCommunityCUDTagPermission error:', error);
    showToastError(error);
  }
};

export default getCommunityCUDTagPermission;
