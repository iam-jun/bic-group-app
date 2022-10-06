import groupApi from '~/api/GroupApi';
import { IPayloadGetGroupStructureCommunityTree } from '~/interfaces/IGroup';
import showError from '~/store/helper/showError';
import IGroupStructureState from '../Interface';

const getGroupStructureCommunityTree = (set, _) => async (payload: IPayloadGetGroupStructureCommunityTree) => {
  const { communityId, showLoading = true } = payload;

  try {
    if (showLoading) {
      set((state: IGroupStructureState) => {
        state.communityTree.loading = true;
      }, 'getGroupStructureCommunityTree');
    }

    const response = await groupApi.getCommunityGroupTree(communityId);

    set((state: IGroupStructureState) => {
      state.communityTree.loading = false;
      state.communityTree.data = response?.data || undefined;
    }, 'getGroupStructureCommunityTreeSuccess');
  } catch (e) {
    set((state: IGroupStructureState) => {
      state.communityTree.loading = false;
    }, 'getGroupStructureCommunityTreeError');
    console.error('\x1b[31m🐣️ action getGroupStructureCommunityTree error: ', e, '\x1b[0m');
    showError(e);
  }
};

export default getGroupStructureCommunityTree;
